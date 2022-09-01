from django.shortcuts import render

# Create your views here.
# chat/views.py

def index(request):
    return render(request, 'userSocket/index.html', {})
    
def room(request, room_name):
    return render(request, 'userSocket/room.html', {
        'room_name': room_name
    })


def profile(request):
    return render(request, 'userSocket/profile.html', {
        
    })

