
class ConnError(Exception):
    pass

obj = {}
try:
    # if('val' in obj):
    # obj['val'].append('5')
    print(''/3)
    # else:
        # obj['val'] = [5]
except ConnError as e:
    print(e)

# try:
#     if('val' in obj):
#         obj['val'].append(5)
#     else:
#         obj['val'] = [5]
# except Exception as e:
#     print(e)

# print(obj)