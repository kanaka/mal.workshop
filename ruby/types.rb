class Function < Proc
    attr_accessor :ast
    attr_accessor :params
    attr_accessor :env

    def initialize(ast, params, env, &block)
        super()
        @ast = ast
        @params = params
        @env = env
    end
end

class Atom
    attr_accessor :meta
    attr_accessor :value
    def initialize(value)
        @value = value
    end
end
