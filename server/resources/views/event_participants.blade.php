<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Event Participants:{{ $eventSports['name'] }} </title>
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
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            vertical-align: top;
            /* Align content to top */
        }

        th {
            background-color: #f2f2f2;
        }

        .watermark {
            position: fixed;
            z-index: -1;
            opacity: 0.08;
            /* Reduced opacity */
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
            /* Additional opacity reduction for right watermark */
        }

        .page-break {
            page-break-before: always;
        }

        .header-table {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-table td {
            border: none;
        }

        .header-image {
            max-width: 100px;
            max-height: 100px;
        }

        .club-number::before {
            content: counter(club-counter) ". ";
        }

        .participant-number::before {
            content: counter(participant-counter) ". ";
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

    <h1>{{ $eventSports['eventName'] }}</h1>

    <table class="header-table">
        <tr>
                <h2>{{ $eventSports['name'] }} Participants</h2>
        </tr>
    </table>

    <table>
        <tr>
            <th>No</th>
            <th>Club Name</th>
        </tr>
        @foreach ($eventSports['clubs'] as $index => $club)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $club['clubName'] }}</td>
            </tr>
        @endforeach
    </table>

    @foreach ($eventSports['clubs'] as $index => $club)
        {{-- <div class="page-break"></div> --}}
        <h2>{{ $index + 1 }}. {{ $club['clubName'] }}</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($club['participants'] as $pIndex => $participant)
                    <tr>
                        <td>{{ $pIndex + 1 }}</td>
                        <td>{{ $participant['member']['firstName'] }} {{ $participant['member']['lastName'] }}</td>
                        <td>{{ $participant['member']['position'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach

    <div class="footer">
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>
</body>

</html>
