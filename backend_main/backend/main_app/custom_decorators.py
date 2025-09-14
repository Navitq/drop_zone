from functools import wraps
from django.http import JsonResponse


def async_require_methods(methods: list[str]):
    def decorator(view_func):
        @wraps(view_func)  # сохраняет имя и docstring оригинальной функции
        async def wrapper(request, *args, **kwargs):
            if request.method not in methods:
                return JsonResponse({"error": "Method not allowed"}, status=405)
            return await view_func(request, *args, **kwargs)
        return wrapper
    return decorator
