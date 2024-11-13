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

        .logo-left {
            position: absolute;
            top: 10px;
            left: 10px;
        }

        .logo-right {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 50px;
        }

        .logo {
            width: 50px;
            display: inline-block;
            vertical-align: middle;
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

        ul {
            padding-left: 20px;
        }

        li {
            margin-bottom: 5px;
        }

        .squad-table {
            width: 100%;
            border-collapse: collapse;
            border: none
        }

        .squad-table td {
            padding: 5px;
            vertical-align: top;
            border: 1px solid #ddd;
        }

        .squad-table img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
        }

        .page-break {
            page-break-before: always;
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
            border-collapse: separate;
            border-spacing: 0 10px;
        }

        .members-table td {
            vertical-align: top;
            padding: 5px;
        }

        .member-image {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }

        .member-info {
            padding-left: 10px;
        }

        .member-name {
            font-weight: bold;
        }

        .member-position,
        .member-contact {
            font-size: 0.9em;
            color: #666;
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

    <div class="club-header">
        <img src="{{ $club->clubImage }}" alt="{{ $club->clubName }}" class="club-image">
        <h1>{{ $club->clubName }} Club Details - {{ date('Y') }}</h1>
    </div>

    <div class="info"><strong>Registered Number:</strong> {{ $club->regNo ?? 'N/A' }}</div>
    <div class="info"><strong>Address:</strong> {{ $club->clubAddress }}</div>
    <div class="info"><strong>Contact No:</strong> {{ $club->clubContactNo }}</div>
    <div class="info"><strong>Division:</strong> {{ $club->gsDivision->divisionNo ?? 'N/A' }} -
        {{ $club->gsDivision->divisionName ?? 'N/A' }}</div>

    <h2>Sports and Arenas</h2>
    <ul>
        @php
            $groupedSports = $club->clubSports->groupBy('sportsCategory.name');
        @endphp
        @foreach ($groupedSports as $sportName => $sportGroups)
            <li>
                {{ $sportName }}
                <ul>
                    @foreach ($sportGroups as $sport)
                        @if ($sport->sportsArena)
                            <li>Arena: {{ $sport->sportsArena->name }}</li>
                        @endif
                    @endforeach
                </ul>
            </li>
        @endforeach
    </ul>

    <h2>Manager</h2>
    @if (isset($club->clubManagers) && count($club->clubManagers) > 0)
        <table class="squad-table">
            @foreach ($club->clubManagers as $manager)
                <tr>
                    <td style="width: 50%;">
                        <img src="{{ $manager->user->image ?? 'https://res.cloudinary.com/dmonsn0ga/image/upload/v1724126491/v17anurj1zsu4cu3hae7.png' }}"
                            alt="{{ $manager->firstName }} {{ $manager->lastName }}">
                    </td>
                    <td>
                        <strong>{{ $manager->firstName }} {{ $manager->lastName }}</strong><br>
                        {{ $manager->contactNo }}
                    </td>
                </tr>
            @endforeach
        </table>
    @else
        <p>No managers available.</p>
    @endif

    <div class="page-break"></div>
    <h2>Members</h2>
    @if (isset($club->members) && count($club->members) > 0)
        @php
            $totalMembers = count($club->members);
            $halfMembers = ceil($totalMembers / 2);
        @endphp
        <table class="members-table">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <table style="width: 100%;">
                        @for ($i = 0; $i < $halfMembers; $i++)
                            @php $member = $club->members[$i]; @endphp
                            <tr>
                                <td style="width: 20px;">{{ $i + 1 }}.</td>
                                <td style="width: 50px;">
                                    <img class="member-image"
                                        src="{{ $member->user->image ?? 'https://res.cloudinary.com/dmonsn0ga/image/upload/v1724126491/v17anurj1zsu4cu3hae7.png' }}"
                                        alt="{{ $member->firstName }} {{ $member->lastName }}">
                                </td>
                                <td class="member-info">
                                    <div class="member-name">{{ $member->firstName }} {{ $member->lastName }}</div>
                                    <div class="member-position">{{ $member->position }}</div>
                                    <div class="member-contact">{{ $member->contactNo }}</div>
                                </td>
                            </tr>
                        @endfor
                    </table>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <table style="width: 100%;">
                        @for ($i = $halfMembers; $i < $totalMembers; $i++)
                            @php $member = $club->members[$i]; @endphp
                            <tr>
                                <td style="width: 20px;">{{ $i + 1 }}.</td>
                                <td style="width: 50px;">
                                    <img class="member-image"
                                        src="{{ $member->user->image ?? 'https://res.cloudinary.com/dmonsn0ga/image/upload/v1724126491/v17anurj1zsu4cu3hae7.png' }}"
                                        alt="{{ $member->firstName }} {{ $member->lastName }}">
                                </td>
                                <td class="member-info">
                                    <div class="member-name">{{ $member->firstName }} {{ $member->lastName }}</div>
                                    <div class="member-position">{{ $member->position }}</div>
                                    <div class="member-contact">{{ $member->contactNo }}</div>
                                </td>
                            </tr>
                        @endfor
                    </table>
                </td>
            </tr>
        </table>
    @else
        <p>No members available.</p>
    @endif


    <div class="footer">
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>
</body>

</html>
