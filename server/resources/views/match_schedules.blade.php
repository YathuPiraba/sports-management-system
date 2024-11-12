<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Match Schedules: {{ $data['eventName'] }}</title>
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

        table {
            width: 100%;
            border-collapse: collapse;
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
        }

        .match-card {
            border: 1px solid #ddd;
            margin-bottom: 15px;
        }

        .vs {
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
    <h2>Match Schedule</h2>

    @foreach ($data['matchDays'] as $matchDay)
        <table>
            <tr>
                <th colspan="4" class="match-date">
                    {{ $matchDay['date'] }}
                </th>
            </tr>

            @php $matchNumber = 1; @endphp <!-- Initialize the match counter for each match day -->

            @foreach ($matchDay['matches'] as $match)
                <tr class="match-card">
                    <td colspan="4">
                        <strong>{{ $matchNumber }}. {{ $match['time'] }}</strong> <!-- Add match number here -->
                    </td>
                </tr>
                <tr>
                    <td class="team">
                        {{ $match['homeClub']['name'] }}
                    </td>
                    <td class="vs">VS</td>
                    <td class="team">
                        {{ $match['awayClub']['name'] }}
                    </td>
                    <td>
                        <div>Sport: {{ $match['sport'] }}</div>
                        <div>Venue: {{ $match['place'] }}</div>
                    </td>
                </tr>
                @php $matchNumber++; @endphp <!-- Increment match counter after each match -->
            @endforeach
        </table>
    @endforeach

    <div class="footer">
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>
</body>

</html>
