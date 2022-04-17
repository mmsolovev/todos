import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from mixer.backend.django import mixer
from userapp.models import User
from .views import ProjectViewSet
from .models import Project, ToDo


class TestProjectViewSet(TestCase):
    def test_create_guest(self):
        factory = APIRequestFactory()
        request = factory.post('/api/projects/', {'name': 'todos', 'repository': 'https://github.com/mmsolovev/todos'},
                               format='json')
        view = ProjectViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_guest(self):
        project = Project.objects.create(name='todos', repository='https://github.com/mmsolovev/todos')
        client = APIClient()
        response = client.put(f'/api/projects/{project.id}/',
                              {'name': 'todos', 'repository': 'https://github.com/mmsolovev/todos'},
                              )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestToDoViewSet(APITestCase):
    def test_get_list(self):
        admin = User.objects.create_superuser('admin', 'admin@admin.com', 'admin123456')
        self.client.login(username='admin', password='admin123456')
        response = self.client.get('/api/todos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_mixer(self):
        todo = mixer.blend(ToDo, text='test')
        admin = User.objects.create_superuser('admin', 'admin@admin.com', 'admin123456')
        self.client.login(username='admin', password='admin123456')
        response = self.client.get(f'/api/todos/{todo.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_book = json.loads(response.content)
        self.assertEqual(response_book['text'], 'test')
