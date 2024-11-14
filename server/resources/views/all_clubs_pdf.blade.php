<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Clubs Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px 10px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
        }

        .logo-left {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 75px;
        }

        .logo-right {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }

        .clubs-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .clubs-table th,
        .clubs-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }

        .clubs-table th:nth-child(3),
        .clubs-table td:nth-child(3) {
            width: 90px;
            /* Adjust width as needed */
        }

        .clubs-table th:nth-child(5),
        .clubs-table td:nth-child(5) {
            width: 140px;
            /* Adjust width as needed */
        }

        .clubs-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }

        .clubs-table tr:nth-child(even) {
            background-color: #f8f9fa;
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
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .sports-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .page-number {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }

        .clubs-table th.total-members {
            text-align: center;
        }

        .clubs-table td.gender-count {
            text-align: center;
            padding: 4px;
            font-size: 11px;
        }

        .gender-header {
            text-align: center;
            font-size: 11px;
            background-color: #f0f0f0;
        }

        .sports-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .sports-list li {
            margin-bottom: 2px;
            padding-left: 12px;
            position: relative;
        }

        .sports-list li:before {
            content: "•";
            position: absolute;
            left: 0;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Sports Clubs Directory - {{ date('Y') }}</h1>
    </div>
    <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1727243516/logo2-1_pyhk2h.png" alt="Left Watermark"
        class="watermark left-watermark">
    <img src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1728452512/11396-removebg-preview_q9leix.png"
        alt="Right Watermark" class="watermark right-watermark">

    <table class="clubs-table">
        <thead>
            <tr>
                <th rowspan="2">S.N</th>
                <th rowspan="2">Club Name</th>
                <th rowspan="2">Sports</th>
                <th rowspan="2">Address</th>
                <th rowspan="2">GN Division</th>
                <th rowspan="2">Registered Number</th>
                <th colspan="2" class="total-members">No. of Members</th>
            </tr>
            <tr>
                <th class="gender-header">Male</th>
                <th class="gender-header">Female</th>
            </tr>
        </thead>
        <tbody>
            @php
            $serialNumber = 1;
            @endphp
            @foreach ($clubs as $club)
            <tr>
                <td>{{ $serialNumber++ }}</td>
                <td>{{ $club->clubName }}</td>
                <td>
                    <ul class="sports-list">
                        @if($club->clubSports->isEmpty())
                        <li>Nil</li>
                        @else
                        @foreach ($club->clubSports->groupBy('sportsCategory.name') as $sportName => $sports)
                        <li>{{ $sportName }}</li>
                        @endforeach
                        @endif
                    </ul>
                </td>
                <td>{{ $club->clubAddress }}</td>
                <td>{{ $club->gsDivision->divisionNo ?? 'N/A' }} - {{ $club->gsDivision->divisionName ?? 'N/A' }}</td>
                <td>{{ $club->regNo ?? 'N/A' }}</td>
                <td class="gender-count">{{ $club->male_count > 0 ? $club->male_count : 'Nil' }}</td>
                <td class="gender-count">{{ $club->female_count > 0 ? $club->female_count : 'Nil' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on: {{ date('F d, Y') }}</p>
        <p>&copy; {{ date('Y') }} ClubConnect. All rights reserved.</p>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $text = "Page {PAGE_NUM} of {PAGE_COUNT}";
            $size = 10;
            $font = $fontMetrics->getFont("Arial");
            $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
            $x = ($pdf->get_width() - $width) / 2;
            $y = $pdf->get_height() - 35;
            $pdf->page_text($x, $y, $text, $font, $size);
        }
    </script>
</body>

</html>
