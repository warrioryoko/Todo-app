from django.shortcuts import render
from django.shortcuts import render_to_response

def home(request):

    return render_to_response('home.html', {})

# Create your views here.


