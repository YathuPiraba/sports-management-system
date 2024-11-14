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
            margin: 0;
            padding: 20px;
        }

        .club-header {
            text-align: left;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 2px;
        }

        .club-image {
            width: 50px;
            vertical-align: middle;
            margin-right: 10px;
            border-radius: 50%;
        }

        h1 {
            color: #2c3e50;
            display: inline-block;
            margin: 0;
            padding-bottom: 2px;
            vertical-align: middle;
        }

        h2 {
            color: #2c3e50;
            margin: 20px 0 10px;
        }

        .info {
            margin-bottom: 10px;
        }

        .info strong {
            color: #2c3e50;
        }

        .sports-list {
            margin: 0;
            padding-left: 20px;
        }

        .sports-list li {
            margin-bottom: 5px;
        }

        .arena-list {
            margin: 0;
            padding-left: 40px;
            list-style-type: circle;
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

        .members-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }

        .members-table th {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-weight: bold;
        }

        .members-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .members-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1727243516/logo2-1_pyhk2h.png" alt="Left Watermark"
        class="watermark left-watermark">
    <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1728452512/11396-removebg-preview_q9leix.png"
        alt="Right Watermark" class="watermark right-watermark">

    <div class="club-header">
        <img src="{{ $club->clubImage }}" alt="{{ $club->clubName }}" class="club-image">
        <h1>{{ $club->clubName }} Club Details - {{ date('Y') }}</h1>
    </div>

    <div class="info"><strong>Registered Number:</strong> {{ $club->regNo ?? 'N/A' }}</div>
    <div class="info"><strong>Address:</strong> {{ $club->clubAddress }}</div>
    <div class="info"><strong>Contact No:</strong> {{ $club->clubContactNo }}</div>
    <div class="info"><strong>Division:</strong> {{ $club->gsDivision->divisionNo ?? 'N/A' }} -
        {{ $club->gsDivision->divisionName ?? 'N/A' }}
    </div>

    <h2>Sports and Arenas</h2>
    <ul class="sports-list">
        @php
        $groupedSports = $club->clubSports->groupBy('sportsCategory.name');
        @endphp
        @foreach ($groupedSports as $sportName => $sportGroups)
        <li>
            {{ $sportName }}
            <ul class="arena-list">
                @foreach ($sportGroups as $sport)
                @if ($sport->sportsArena)
                <li>Arena: {{ $sport->sportsArena->name }}</li>
                @endif
                @endforeach
            </ul>
        </li>
        @endforeach
    </ul>

    <h2>Club Manager and Members  </h2>
    <table class="members-table">
        <thead>
            <tr>
                <th>S.N</th>
                <th>Name</th>
                <th>Role</th>
                <th>Position</th>
                <th>Contact Number</th>
                <th>Gender</th>
            </tr>
        </thead>
        <tbody>
            @php
            $serialNumber = 1;
            // Combine managers and members into one collection
            $allPeople = collect();

            // Add managers with role
            foreach($club->clubManagers as $manager) {
            $manager->role = 'Manager';
            $allPeople->push($manager);
            }

            // Add members with role
            foreach($club->members as $member) {
            $member->role = 'Member';
            $allPeople->push($member);
            }

 
            @endphp

            @foreach($allPeople as $person)
            <tr>
                <td>{{ $serialNumber++ }}</td>
                <td>{{ $person->firstName }} {{ $person->lastName }}</td>
                <td>{{ $person->role }}</td>
                <td>{{ $person->position ?? 'N/A' }}</td>
                <td>{{ $person->contactNo }}</td>
                <td>{{ ucfirst($person->gender) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on: {{ date('F d, Y') }}</p>
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>
</body>

</html>
