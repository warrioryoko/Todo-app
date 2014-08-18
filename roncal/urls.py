from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
from apps.cal import views
admin.autodiscover()


from apps.cal.resources import ToDoResource
from tastypie.api import Api

v1_api = Api(api_name='v1')
v1_api.register( ToDoResource() )


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'roncal.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(v1_api.urls)),
    (r'^home', views.home),
)

