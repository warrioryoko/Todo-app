from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie.resources import fields
from models import ToDo

class ToDoResource(ModelResource):
	class Meta:
		queryset = ToDo.objects.all()
		authorization = Authorization()
