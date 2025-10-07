<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
        'status',
        'type',
        'location',
        'link',
        'image',
        'category',
        'organizer_id'
    ];

    public function organizer(){
        return $this->belongsTo(User::class, 'organizer_id');
    }
}
