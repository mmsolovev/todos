import graphene
from graphene_django import DjangoObjectType
from userapp.models import User
from todoapp.models import Project, ToDo


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = '__all__'


class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)

    def resolve_all_users(root, info):
        return User.objects.all()

    all_projects = graphene.List(ProjectType)

    def resolve_all_projects(root, info):
        return Project.objects.all()

    all_todos = graphene.List(ToDoType)

    def resolve_all_todos(root, info):
        return ToDo.objects.all()


schema = graphene.Schema(query=Query)
