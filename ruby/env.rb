class Env
    attr_accessor :data
    def initialize(outer=nil)
        @data = {}
        @outer = outer
        return self
    end

    def find(key)
        if @data.key? key
            return self
        elsif @outer
            return @outer.find(key)
        else
            return nil
        end
    end

    def set(key, value)
        @data[key] = value
        return value
    end

    def get(key)
        env = find(key)
        raise "'" + key.to_s + "' not found" if not env
        env.data[key]
    end
end
