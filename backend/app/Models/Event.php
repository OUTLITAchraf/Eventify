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
        'category_id',
        'organizer_id'
    ];

    public function organizer(){
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    } 
    
    public function participants() {
        return $this->hasMany(Participant::class);
    }
}
