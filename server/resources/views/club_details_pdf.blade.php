<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Club Details: {{ $club->clubName }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #2980b9;
            margin-top: 20px;
        }
        ul {
            padding-left: 20px;
        }
        .info {
            margin-bottom: 10px;
        }
        .info strong {
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <h1>{{ $club->clubName }}</h1>
    <div class="info"><strong>Address:</strong> {{ $club->clubAddress }}</div>
    <div class="info"><strong>Contact No:</strong> {{ $club->clubContactNo }}</div>
    <div class="info"><strong>Division:</strong> {{ $club->gsDivision->divisionName }}</div>

    <h2>Managers</h2>
    <ul>
        @if(isset($club->club_managers) && count($club->club_managers) > 0)
            @foreach($club->club_managers as $manager)
                <li>{{ $manager->firstName }} {{ $manager->lastName }} - {{ $manager->contactNo }}</li>
            @endforeach
        @else
            <li>No managers available.</li>
        @endif
    </ul>

    <h2>Members</h2>
    <ul>
        @if(isset($club->members) && count($club->members) > 0)
            @foreach($club->members as $member)
                <li>{{ $member->firstName }} {{ $member->lastName }} - {{ $member->contactNo }}</li>
            @endforeach
        @else
            <li>No members available.</li>
        @endif
    </ul>

</body>
</html>
