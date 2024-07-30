<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gs_divisions', function (Blueprint $table) {
            $table->id();
            $table->string('divisionName')->unique();
            $table->string('divisionNo')->unique();
            $table->string('gs_Name');
            $table->string('contactNo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gs_divisions');
    }
};
