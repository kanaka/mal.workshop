require "readline"
require_relative "reader"
require_relative "printer"
require_relative "env"

# read
def READ(str)
    return read_str(str)
end

# eval
def eval_ast(ast, env)
    return case ast
        when Symbol
            env.get(ast)
        when Array
            Array.new ast.map{|a| EVAL(a, env)}
        else
            ast
    end
end

def EVAL(ast, env)
    if not ast.is_a? Array
        return eval_ast(ast, env)
    end
    if ast.empty?
        return ast
    end

    # apply list
    a0,a1,a2 = ast
    case a0
    when :def!
        return env.set(a1, EVAL(a2, env))
    when :'let*'
        let_env = Env.new(env)
        a1.each_slice(2) do |a,e|
            let_env.set(a, EVAL(e, let_env))
        end
        return EVAL(a2, let_env)
    else
        el = eval_ast(ast, env)
        f = el[0]
        return f[*el.drop(1)]
    end
end

# print
def PRINT(exp)
    return pr_str(exp)
end

# repl
repl_env = Env.new(nil)
repl_env.set(:+, lambda {|a,b| a + b})
repl_env.set(:-, lambda {|a,b| a - b})
repl_env.set(:*, lambda {|a,b| a * b})
repl_env.set(:/, lambda {|a,b| a / b})

def REP(str, env)
    return PRINT(EVAL(READ(str), env))
end

# repl loop
while line = Readline.readline("user> ", true)
    begin
        puts REP(line, repl_env)
    rescue Exception => e
        puts "Error: #{e}"
        puts "\t#{e.backtrace.join("\n\t")}"
    end
end
