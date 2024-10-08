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
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('clubName')->unique();
            $table->unsignedBigInteger('gs_id');
            $table->text('clubAddress');
            $table->text('club_history')->nullable();
            $table->string('clubContactNo');
            $table->string('clubImage')->nullable();
            $table->boolean('isVerified')->default(false);
            $table->timestamps();

            $table->foreign('gs_id')->references('id')->on('gs_divisions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clubs');
    }
};
