<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Participants</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1, h2, h3 { margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>{{ $eventSports['name'] }} Participants</h1>
    <p>Date: {{ $eventSports['start_date'] }} to {{ $eventSports['end_date'] }}</p>
    <p>Place: {{ $eventSports['place'] }}</p>
    <p>Sport: {{ $eventSports['sports']['name'] }}</p>

    @foreach($eventSports['clubs'] as $club)
        <h2>{{ $club['clubName'] }}</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
            <tbody>
                @foreach($club['participants'] as $participant)
                    <tr>
                        <td>{{ $participant['member']['firstName'] }} {{ $participant['member']['lastName'] }}</td>
                        <td>{{ $participant['member']['position'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
</body>
</html>
