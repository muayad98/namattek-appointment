from bson import ObjectId

def to_str(d):
    """Recursively convert Mongo ObjectIds to strings."""
    if isinstance(d, list):
        return [to_str(i) for i in d]
    if isinstance(d, dict):
        return {k: to_str(v) for k, v in d.items()}
    if isinstance(d, ObjectId):
        return str(d)
    return d
