class Env():
    def __init__(self, outer=None):
        self.data = {}
        self.outer = outer

    def set(self, key, value):
        self.data[key] = value
        return value

    def find(self, key):
        if key in self.data: return self
        elif self.outer:     return self.outer.find(key)
        else:                return None

    def get(self, key):
        env = self.find(key)
        if not env: raise Exception("'" + key + "' not found")
        return env.data[key]
