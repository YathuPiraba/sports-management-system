<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\EventClub;
use App\Models\Events;
use App\Models\EventSports;
use App\Models\MatchResult;
use App\Models\MatchSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class MatchResultController extends Controller
{
    /**
     * Create a new match result.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'match_id' => 'required|exists:matches,id',
            'home_club_id' => 'required|exists:clubs,id',
            'away_club_id' => 'required|exists:clubs,id',
            'home_score' => 'required|integer',
            'away_score' => 'required|integer',
            'winner_club_id' => 'nullable|exists:clubs,id',
        ]);

        // Determine the result based on winner_club_id
        $result = null;
        if ($request->winner_club_id) {
            // If a winner is provided, the result should be a win for that club
            $result = $request->winner_club_id === $request->home_club_id ? 'Home Win' : 'Away Win';
        } else {
            // If no winner, it's a draw
            $result = 'Draw';
        }

        // Create a new match result record
        $matchResult = MatchResult::create([
            'match_id' => $request->match_id,
            'home_score' => $request->home_score,
            'away_score' => $request->away_score,
            'winner_club_id' => $request->winner_club_id,
            'result' => $result,
        ]);

        // Return the created match result in the response
        return response()->json($matchResult, Response::HTTP_CREATED);
    }

    public function getClubStats($eventId)
    {
        // First, get all clubs that participated in matches for this event
        $participatingClubs = Club::whereHas('homeMatches', function ($query) use ($eventId) {
            $query->whereHas('eventSport', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            });
        })->orWhereHas('awayMatches', function ($query) use ($eventId) {
            $query->whereHas('eventSport', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            });
        })->get();

        $clubStats = $participatingClubs->map(function ($club) use ($eventId) {
            // Get all matches where this club participated
            $matches = MatchSchedule::where(function ($query) use ($club) {
                $query->where('home_club_id', $club->id)
                    ->orWhere('away_club_id', $club->id);
            })->whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->with('matchResults')->get();

            // Initialize counters
            $wins = 0;
            $draws = 0;
            $losses = 0;

            foreach ($matches as $match) {
                if ($match->matchResults) {
                    $result = $match->matchResults;

                    if ($result->winner_club_id === $club->id) {
                        // Club won
                        $wins++;
                    } elseif ($result->winner_club_id === null) {
                        // Match was a draw
                        $draws++;
                    } else {
                        // Club lost
                        $losses++;
                    }
                }
            }

            return [
                'club_id' => $club->id,
                'club_name' => $club->clubName,
                'total_matches' => count($matches),
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'points' => ($wins * 3) + ($draws * 1) // Standard scoring: 3 points for win, 1 for draw
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $clubStats,
        ], 200);
    }

    public function getClubEventSportsStats($eventId, $clubId)
    {
        // First verify the club exists and participated in the event
        $club = Club::findOrFail($clubId);

        // Get all event sports for the event
        $eventSportsStats = EventSports::where('event_id', $eventId)
            ->whereHas('matches', function ($query) use ($clubId) {
                $query->where('home_club_id', $clubId)
                    ->orWhere('away_club_id', $clubId);
            })
            ->with(['sportCategory', 'matches' => function ($query) use ($clubId) {
                $query->where('home_club_id', $clubId)
                    ->orWhere('away_club_id', $clubId);
                $query->with('matchResults');
            }])
            ->get()
            ->map(function ($eventSport) use ($clubId) {
                // Initialize stats
                $stats = [
                    'event_sports_id' => $eventSport->id,
                    'sport_name' => $eventSport->sportCategory->name,
                    'total_matches' => 0,
                    'wins' => 0,
                    'draws' => 0,
                    'losses' => 0,
                    'points' => 0,
                    'matches' => []
                ];

                // Calculate statistics for each match
                foreach ($eventSport->matches as $match) {
                    $matchStats = [
                        'match_id' => $match->id,
                        'match_date' => $match->match_date,
                        'time' => $match->time,
                        'home_club_id' => $match->home_club_id,
                        'away_club_id' => $match->away_club_id,
                    ];

                    $stats['total_matches']++;

                    if ($match->matchResults) {
                        $result = $match->matchResults;
                        $matchStats['home_score'] = $result->home_score;
                        $matchStats['away_score'] = $result->away_score;

                        if ($result->winner_club_id === $clubId) {
                            $stats['wins']++;
                            $stats['points'] += 3;
                            $matchStats['result'] = 'win';
                        } elseif ($result->winner_club_id === null) {
                            $stats['draws']++;
                            $stats['points'] += 1;
                            $matchStats['result'] = 'draw';
                        } else {
                            $stats['losses']++;
                            $matchStats['result'] = 'loss';
                        }
                    } else {
                        $matchStats['result'] = 'pending';
                    }

                    $stats['matches'][] = $matchStats;
                }

                // Add performance metrics
                $stats['win_percentage'] = $stats['total_matches'] > 0
                    ? round(($stats['wins'] / $stats['total_matches']) * 100, 2)
                    : 0;

                return $stats;
            });

        // Calculate overall statistics across all sports
        $overallStats = [
            'total_matches' => $eventSportsStats->sum('total_matches'),
            'total_wins' => $eventSportsStats->sum('wins'),
            'total_draws' => $eventSportsStats->sum('draws'),
            'total_losses' => $eventSportsStats->sum('losses'),
            'total_points' => $eventSportsStats->sum('points'),
            'overall_win_percentage' => $eventSportsStats->sum('total_matches') > 0
                ? round(($eventSportsStats->sum('wins') / $eventSportsStats->sum('total_matches')) * 100, 2)
                : 0
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'club_id' => $clubId,
                'club_name' => $club->clubName,
                'event_id' => $eventId,
                'overall_stats' => $overallStats,
                'sports_stats' => $eventSportsStats
            ]
        ], 200);
    }

    public function getAllClubsSportsStats($eventId)
    {
        // Get all clubs that participated in the event
        $participatingClubs = Club::whereHas('homeMatches', function ($query) use ($eventId) {
            $query->whereHas('eventSport', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            });
        })->orWhereHas('awayMatches', function ($query) use ($eventId) {
            $query->whereHas('eventSport', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            });
        })->get();

        // Get all event sports for this event
        $eventSports = EventSports::where('event_id', $eventId)
            ->with('sportsCategory')
            ->get();

        $clubsStats = $participatingClubs->map(function ($club) use ($eventId, $eventSports) {
            // Initialize club stats structure
            $clubData = [
                'club_id' => $club->id,
                'club_name' => $club->clubName,
                'overall_stats' => [
                    'total_matches' => 0,
                    'total_wins' => 0,
                    'total_draws' => 0,
                    'total_losses' => 0,
                    'total_points' => 0
                ],
                'sports_stats' => []
            ];

            // Calculate stats for each event sport
            foreach ($eventSports as $eventSport) {
                // Get matches for this club in this sport
                $matches = MatchSchedule::where(function ($query) use ($club) {
                    $query->where('home_club_id', $club->id)
                        ->orWhere('away_club_id', $club->id);
                })->where('event_sports_id', $eventSport->id)
                    ->with('matchResults')
                    ->get();

                $sportStats = [
                    'sport_id' => $eventSport->id,
                    'sport_name' => $eventSport->name,
                    'matches_played' => 0,
                    'wins' => 0,
                    'draws' => 0,
                    'losses' => 0,
                    'points' => 0,
                    // 'goals_for' => 0,      // Total goals/points scored
                    // 'goals_against' => 0,   // Total goals/points conceded
                    // 'goal_difference' => 0  // Difference between scored and conceded
                ];

                foreach ($matches as $match) {
                    if ($match->matchResults) {
                        $sportStats['matches_played']++;
                        $result = $match->matchResults;

                        // Calculate goals for/against
                        // if ($match->home_club_id === $club->id) {
                        //     $sportStats['goals_for'] += $result->home_score;
                        //     $sportStats['goals_against'] += $result->away_score;
                        // } else {
                        //     $sportStats['goals_for'] += $result->away_score;
                        //     $sportStats['goals_against'] += $result->home_score;
                        // }

                        if ($result->winner_club_id === $club->id) {
                            $sportStats['wins']++;
                            $sportStats['points'] += 3;
                        } elseif ($result->winner_club_id === null) {
                            $sportStats['draws']++;
                            $sportStats['points'] += 1;
                        } else {
                            $sportStats['losses']++;
                        }
                    }
                }

                // Calculate additional stats
                // $sportStats['goal_difference'] = $sportStats['goals_for'] - $sportStats['goals_against'];
                $sportStats['win_percentage'] = $sportStats['matches_played'] > 0
                    ? round(($sportStats['wins'] / $sportStats['matches_played']) * 100, 2)
                    : 0;

                // Update overall stats
                $clubData['overall_stats']['total_matches'] += $sportStats['matches_played'];
                $clubData['overall_stats']['total_wins'] += $sportStats['wins'];
                $clubData['overall_stats']['total_draws'] += $sportStats['draws'];
                $clubData['overall_stats']['total_losses'] += $sportStats['losses'];
                $clubData['overall_stats']['total_points'] += $sportStats['points'];

                // Only add sports where the club participated
                if ($sportStats['matches_played'] > 0) {
                    $clubData['sports_stats'][] = $sportStats;
                }
            }

            // Calculate overall win percentage
            $clubData['overall_stats']['win_percentage'] = $clubData['overall_stats']['total_matches'] > 0
                ? round(($clubData['overall_stats']['total_wins'] / $clubData['overall_stats']['total_matches']) * 100, 2)
                : 0;

            return $clubData;
        });

        // Sort clubs by total points in descending order
        $clubsStats = $clubsStats->sortByDesc(function ($club) {
            return $club['overall_stats']['total_points'];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'event_id' => $eventId,
                'total_clubs' => count($clubsStats),
                'clubs' => $clubsStats
            ]
        ], 200);
    }

    private function calculateClubStats($eventSport, $club)
    {
        // Get matches for this club in this sport
        $matches = MatchSchedule::where('event_sports_id', $eventSport->id)
            ->where(function ($query) use ($club) {
                $query->where('home_club_id', $club->id)
                    ->orWhere('away_club_id', $club->id);
            })
            ->with('matchResults')
            ->get();

        $stats = [
            'club_id' => $club->id,
            'club_name' => $club->clubName,
            'matches_played' => 0,
            'wins' => 0,
            'draws' => 0,
            'losses' => 0,
            'points' => 0,
            'win_percentage' => 0,
            'total_scores_for' => 0,
            'total_scores_against' => 0
        ];

        foreach ($matches as $match) {
            if ($match->matchResults) {
                $stats['matches_played']++;
                $result = $match->matchResults;

                // Calculate scores for and against
                if ($match->home_club_id === $club->id) {
                    $stats['total_scores_for'] += $result->home_score;
                    $stats['total_scores_against'] += $result->away_score;
                } else {
                    $stats['total_scores_for'] += $result->away_score;
                    $stats['total_scores_against'] += $result->home_score;
                }

                if ($result->winner_club_id === $club->id) {
                    $stats['wins']++;
                    $stats['points'] += 3;
                } elseif ($result->winner_club_id === null) {
                    $stats['draws']++;
                    $stats['points'] += 1;
                } else {
                    $stats['losses']++;
                }
            }
        }

        $stats['win_percentage'] = $stats['matches_played'] > 0
            ? round(($stats['wins'] / $stats['matches_played']) * 100, 2)
            : 0;

        return $stats;
    }

    private function updateClubRanks($eventSport, $clubStats)
    {
        foreach ($clubStats as $index => $stat) {
            $rank = $index + 1;
            EventClub::where('club_id', $stat['club_id'])
                ->where('event_sports_id', $eventSport->id)
                ->update(['rank' => $rank]);
        }
    }


    private function buildSportWinnerData($eventSport, $leader, $clubStats, $tournamentEnded, $event)
    {
        $leaderDetails = Club::find($leader['club_id']);

        $sportWinner = [
            'sport_id' => $eventSport->id,
            'sport_name' => $eventSport->name,
            'tournament_status' => $tournamentEnded ? 'completed' : 'ongoing',
            'winner' => [
                'club_id' => $leaderDetails->id,
                'club_name' => $leaderDetails->clubName,
                'club_image' => $leaderDetails->clubImage,
                'performance' => [
                    'matches_played' => $leader['matches_played'],
                    'wins' => $leader['wins'],
                    'draws' => $leader['draws'],
                    'losses' => $leader['losses'],
                    'points' => $leader['points'],
                    'win_percentage' => $leader['win_percentage'],
                    'total_scores_for' => $leader['total_scores_for'],
                    'total_scores_against' => $leader['total_scores_against']
                ]
            ],
            'total_participants' => count($clubStats),
            'team_standings' => array_map(function ($stat) use ($tournamentEnded) {
                return [
                    'club_id' => $stat['club_id'],
                    'club_name' => $stat['club_name'],
                    'rank' => $tournamentEnded ? $stat['rank'] : null,
                    'matches_played' => $stat['matches_played'],
                    'wins' => $stat['wins'],
                    'draws' => $stat['draws'],
                    'losses' => $stat['losses'],
                    'points' => $stat['points'],
                    'win_percentage' => $stat['win_percentage'],
                    'total_scores_for' => $stat['total_scores_for'],
                    'total_scores_against' => $stat['total_scores_against']
                ];
            }, $clubStats)
        ];

        // Add tournament specific details
        if ($tournamentEnded) {
            $sportWinner['tournament_name'] = $event->name;
            $sportWinner['winner']['status'] = 'Champion';
        } else {
            $sportWinner['tournament_name'] = $event->name . ' (Ongoing)';
            $sportWinner['winner']['status'] = 'Current Leader';
        }

        return $sportWinner;
    }

    public function getEventSportsWinners($eventId)
    {
        // Get event details first to check end date
        $event = Events::find($eventId);
        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], 404);
        }

        // Get all event sports for this event
        $eventSports = EventSports::where('event_id', $eventId)
            ->with('sportsCategory')
            ->get();

        $sportsWinners = [];
        $tournamentEnded = $event->end_date < now();

        foreach ($eventSports as $eventSport) {
            // Get all clubs that participated in this sport
            $participatingClubs = Club::whereHas('homeMatches', function ($query) use ($eventSport) {
                $query->where('event_sports_id', $eventSport->id);
            })->orWhereHas('awayMatches', function ($query) use ($eventSport) {
                $query->where('event_sports_id', $eventSport->id);
            })->get();

            $clubStats = [];

            foreach ($participatingClubs as $club) {
                // Calculate club stats
                $stats = $this->calculateClubStats($eventSport, $club);
                if ($stats['matches_played'] > 0) {
                    $clubStats[] = $stats;
                }
            }

            // Sort clubs by ranking criteria
            usort($clubStats, function ($a, $b) {
                if ($a['points'] !== $b['points']) {
                    return $b['points'] - $a['points'];
                }
                if ($a['wins'] !== $b['wins']) {
                    return $b['wins'] - $a['wins'];
                }
                return 0;
            });

            // Update ranks in database if tournament has ended
            if ($tournamentEnded) {
                $this->updateClubRanks($eventSport, $clubStats);
            }

            // Get leader details (either winner if ended, or current leader if ongoing)
            $leader = !empty($clubStats) ? $clubStats[0] : null;
            if ($leader) {
                $sportWinner = $this->buildSportWinnerData($eventSport, $leader, $clubStats, $tournamentEnded, $event);
                $sportsWinners[] = $sportWinner;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'event_id' => $eventId,
                'event_status' => $tournamentEnded ? 'completed' : 'ongoing',
                'total_sports' => count($sportsWinners),
                'sports_winners' => $sportsWinners
            ]
        ], 200);
    }

    public function getEventMatchesResults($eventId, Request $request)
    {
        try {
            // Check if the event exists
            $event = Events::find($eventId);
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found'
                ], 404);
            }

            // Get pagination and search parameters from request
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $searchTerm = $request->input('search');
            $sportName = $request->input('sport', '');

            // Determine if the tournament has ended
            $tournamentEnded = $event->end_date < now();

            // Build base query for match results
            $baseQuery = MatchSchedule::query()
                ->join('event_sports', 'matches.event_sports_id', '=', 'event_sports.id')
                ->join('match_results', 'matches.id', '=', 'match_results.match_id')
                ->where('event_sports.event_id', $eventId)
                ->when($sportName && $sportName !== 'all', function ($query) use ($sportName) {
                    return $query->where('event_sports.name', $sportName);
                })
                ->when($searchTerm, function ($query) use ($searchTerm) {
                    return $query->where('event_sports.name', 'like', '%' . $searchTerm . '%');
                })
                ->orderBy('matches.match_date', 'desc')
                ->orderBy('time', 'asc');

            // Get total count before pagination
            $totalMatches = $baseQuery->count();

            // Get paginated matches with relationships
            $matches = $baseQuery->with(['matchResults', 'homeClub', 'awayClub', 'eventSport'])
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            // Format match results
            $matchResults = [];
            foreach ($matches as $match) {
                if ($match->matchResults) {
                    $result = $match->matchResults;
                    $homeClub = $match->homeClub;
                    $awayClub = $match->awayClub;
                    $eventSport = $match->eventSport;

                    $matchResults[] = [
                        'match_id' => $match->id,
                        'match_date' => $match->match_date,
                        'match_time' => $match->time,
                        'sport_id' => $eventSport->id,
                        'sport_name' => $eventSport->name,
                        'venue' => $eventSport->place,
                        'home_team' => [
                            'club_id' => $homeClub->id,
                            'club_name' => $homeClub->clubName,
                            'score' => $result->home_score,
                            'result' => $result->winner_club_id === $homeClub->id ? 'winner' : ($result->winner_club_id === null ? 'draw' : 'loser')
                        ],
                        'away_team' => [
                            'club_id' => $awayClub->id,
                            'club_name' => $awayClub->clubName,
                            'score' => $result->away_score,
                            'result' => $result->winner_club_id === $awayClub->id ? 'winner' : ($result->winner_club_id === null ? 'draw' : 'loser')
                        ],
                        'winner_id' => $result->winner_club_id,
                        'match_status' => $result->winner_club_id === null ? 'draw' : 'completed'
                    ];
                }
            }

            // Get all sports for the dropdown (keeping original structure)
            $sports = EventSports::where('event_id', $eventId)
                ->pluck('name')
                ->unique()
                ->values()
                ->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'event_id' => $eventId,
                    'event_status' => $tournamentEnded ? 'completed' : 'ongoing',
                    'sports' => $sports,
                    'match_results' => $matchResults,
                    'pagination' => [
                        'total_matches' => $totalMatches,
                        'current_page' => (int)$page,
                        'last_page' => ceil($totalMatches / $perPage),
                        'per_page' => (int)$perPage,
                    ]
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching event match results: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching event match results: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function generateMatchResultsPDF($eventId)
    {
        try {
            // Get event details
            $event = Events::find($eventId);

            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found.',
                ], 404);
            }

            // Get match results with relationships
            $query = MatchSchedule::whereHas('eventSport', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->with([
                'homeClub:id,clubName,clubImage',
                'awayClub:id,clubName,clubImage',
                'eventSport:id,name,start_date,end_date,place,sports_id',
                'matchResults'
            ])->whereHas('matchResults'); // Only get matches with results

            // Get sorted results
            $matches = $query->orderBy('match_date', 'asc')
                ->orderBy('time', 'asc')
                ->get();

            // Group matches by date
            $groupedMatches = $matches->groupBy(function ($match) {
                return \Carbon\Carbon::parse($match->match_date)->format('Y-m-d');
            });

            // Format data for PDF
            $formattedData = [];
            foreach ($groupedMatches as $date => $matches) {
                $matchesForDate = $matches->map(function ($match) {
                    $result = $match->matchResults;
                    $homeClub = $match->homeClub;
                    $awayClub = $match->awayClub;

                    return [
                        'time' => $match->time,
                        'sport' => $match->eventSport->name,
                        'venue' => $match->eventSport->place,
                        'homeTeam' => [
                            'name' => $homeClub->clubName,
                            'score' => $result->home_score,
                            'isWinner' => $result->winner_club_id === $homeClub->id,
                            'image' => $homeClub->clubImage ?? null,
                        ],
                        'awayTeam' => [
                            'name' => $awayClub->clubName,
                            'score' => $result->away_score,
                            'isWinner' => $result->winner_club_id === $awayClub->id,
                            'image' => $awayClub->clubImage ?? null,
                        ],
                        'isDraw' => $result->winner_club_id === null,
                    ];
                });

                $formattedData[] = [
                    'date' => \Carbon\Carbon::parse($date)->format('F d, Y'),
                    'matches' => $matchesForDate
                ];
            }

            $viewData = [
                'eventName' => $event->name,
                'matchDays' => $formattedData,
                'eventStatus' => $event->end_date < now() ? 'Completed' : 'Ongoing'
            ];

            // Generate PDF
            $pdf = PDF::loadView('match_results', ['data' => $viewData]);

            // Generate filename
            $filename = 'match_results_' . preg_replace('/[^A-Za-z0-9\-]/', '_', $event->name) . '.pdf';

            // Return PDF for download
            return $pdf->download($filename);
        } catch (\Exception $e) {
            Log::error('Error generating match results PDF: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all results for a specific match schedule.
     *
     * @param int $matchScheduleId
     * @return \Illuminate\Http\Response
     */
    public function index($matchScheduleId)
    {
        $results = MatchResult::where('match_schedule_id', $matchScheduleId)->get();
        return response()->json($results);
    }

    /**
     * Get a specific match result.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = MatchResult::findOrFail($id);
        return response()->json($result);
    }

    /**
     * Update a specific match result.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'match_schedule_id' => 'sometimes|required|exists:match_schedules,id',
            'winner_club_id' => 'sometimes|required|exists:clubs,id',
            'score_club_1' => 'sometimes|required|integer',
            'score_club_2' => 'sometimes|required|integer',
        ]);

        $result = MatchResult::findOrFail($id);
        $result->update($request->all());

        return response()->json($result);
    }

    /**
     * Delete a specific match result.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $result = MatchResult::findOrFail($id);
        $result->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
