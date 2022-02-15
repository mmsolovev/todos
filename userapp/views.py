from rest_framework import viewsets
from rest_framework.viewsets import mixins
from .models import User
from .serializers import UserSerializer, UserSerializerStaff


class UserViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.version == '0.2':
            return UserSerializerStaff
        return UserSerializer
