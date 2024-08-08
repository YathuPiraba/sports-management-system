<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gs_Division;


class GsDivisionController extends Controller
{
    //GET => http://127.0.0.1:8000/api/gs-divisions
    public function getAllGsDivisions()
    {
        try {
            $gsDivisions = Gs_Division::all();

            return response()->json([
                'success' => true,
                'data' => $gsDivisions
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching GS Divisions: ' . $e->getMessage()
            ], 500);
        }
    }
}
