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

        .header {
            position: relative;
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 100px;
        }

        .club-image {
            max-width: 200px;
            margin-bottom: 10px;
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

        .squad-member {
            display: inline-block;
            width: 150px;
            margin: 10px;
            text-align: center;
        }

        .squad-member img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
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
    <div class="header">
        <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1723798132/logo2_qanauk.png" alt="Club Connect Logo"
            class="logo">
        <img src="{{ $club->clubImage }}" alt="{{ $club->clubName }}" class="club-image">
        <h1>{{ $club->clubName }}</h1>
    </div>

    <div class="info"><strong>Address:</strong> {{ $club->clubAddress }}</div>
    <div class="info"><strong>Contact No:</strong> {{ $club->clubContactNo }}</div>
    <div class="info"><strong>Division:</strong> {{ $club->gsDivision->divisionName }}</div>

    <h2>Sports and Arenas</h2>
    <ul>
        @foreach ($club->clubSports as $clubSport)
            <li>
                {{ $clubSport->sportsCategory->name }} - Arena: {{ $clubSport->sportsArena->name }}
            </li>
        @endforeach
    </ul>

    <h2>Managers</h2>
    <div class="squad">
        @if (isset($club->clubManagers) && count($club->clubManagers) > 0)
            @foreach ($club->clubManagers as $manager)
                <div class="squad-member">
                    <img src="{{ $manager->image ?? 'https://res.cloudinary.com/dmonsn0ga/image/upload/v1724126491/v17anurj1zsu4cu3hae7.png' }}"
                        alt="{{ $manager->firstName }} {{ $manager->lastName }}">
                    <p>{{ $manager->firstName }} {{ $manager->lastName }}</p>
                    <p>{{ $manager->position }}</p>
                    <p>{{ $manager->contactNo }}</p>
                </div>
            @endforeach
        @else
            <li>No managers available.</li>
        @endif
    </div>

    <h2>Members</h2>
    <div class="squad">
        @if (isset($club->members) && count($club->members) > 0)
            @foreach ($club->members as $member)
                <div class="squad-member">
                    <img src="{{ $member->image ?? 'https://res.cloudinary.com/dmonsn0ga/image/upload/v1724126491/v17anurj1zsu4cu3hae7.png' }}"
                        alt="{{ $member->firstName }} {{ $member->lastName }}">
                    <p>{{ $member->firstName }} {{ $member->lastName }}</p>
                    <p>{{ $member->position }}</p>
                    <p>{{ $member->contactNo }}</p>
                </div>
            @endforeach
        @else
            <li>No members available.</li>
        @endif
    </div>

    <div class="footer">
        <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1728452512/11396-removebg-preview_q9leix.png"
            alt="Footer Logo" style="width: 50px;">
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>
</body>

</html>
