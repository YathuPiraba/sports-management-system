<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Match Results: {{ $data['eventName'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }

        h1,
        h2,
        h3 {
            margin-bottom: 10px;
            text-align: center;
        }

        .event-status {
            text-align: center;
            padding: 5px;
            margin-bottom: 20px;
            font-weight: bold;
            color: #2c3e50;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .match-date {
            background-color: #f2f2f2;
            font-weight: bold;
            padding: 10px;
            text-align: left;
        }

        .score {
            font-weight: bold;
            font-size: 1.2em;
        }

        .winner {
            color: #27ae60;
            font-weight: bold;
        }

        .loser {
            color: #c0392b;
        }

        .draw {
            color: #f39c12;
            font-weight: bold;
        }

        .watermark {
            position: fixed;
            z-index: -1;
            opacity: 0.08;
            width: 50px;
            height: auto;
        }

        .left-watermark {
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }

        .right-watermark {
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.07;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>

<body>
    <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1727243516/logo2-1_pyhk2h.png" alt="Left Watermark"
        class="watermark left-watermark">
    <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1728452512/11396-removebg-preview_q9leix.png"
        alt="Right Watermark" class="watermark right-watermark">

    <h1>{{ $data['eventName'] }}</h1>
    <h2>Match Results</h2>
    <div class="event-status">Tournament Status: {{ $data['eventStatus'] }}</div>

    @foreach ($data['matchDays'] as $matchDay)
        <table>
            <tr>
                <th colspan="6" class="match-date">
                    {{ $matchDay['date'] }}
                </th>
            </tr>
            <tr>
                <th>No.</th>
                <th>Time</th>
                <th>Sport & Venue</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Result</th>
            </tr>

            @foreach ($matchDay['matches'] as $index => $match)
                <tr>
                    <td>{{ $index + 1 }}</td> <!-- Match numbering for each day -->
                    <td>{{ $match['time'] }}</td>
                    <td>
                        <div><strong>{{ $match['sport'] }}</strong></div>
                        <div>{{ $match['venue'] }}</div>
                    </td>
                    <td class="{{ $match['homeTeam']['isWinner'] ? 'winner' : ($match['isDraw'] ? 'draw' : 'loser') }}">
                        {{ $match['homeTeam']['name'] }}
                    </td>
                    <td
                        class="{{ $match['awayTeam']['isWinner'] ? 'winner' : ($match['isDraw'] ? 'draw' : 'loser') }}">
                        {{ $match['awayTeam']['name'] }}
                    </td>
                    <td>
                        <span class="score">
                            {{ $match['homeTeam']['score'] }} - {{ $match['awayTeam']['score'] }}
                        </span>
                        <br>
                        @if ($match['isDraw'])
                            <span class="draw">Draw</span>
                        @else
                            <span class="winner">
                                Winner:
                                {{ $match['homeTeam']['isWinner'] ? $match['homeTeam']['name'] : $match['awayTeam']['name'] }}
                            </span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </table>
    @endforeach

    <div class="footer">
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>
</body>

</html>
