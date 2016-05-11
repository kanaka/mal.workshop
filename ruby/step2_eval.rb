require "readline"
require_relative "reader"
require_relative "printer"

# read
def READ(str)
    return read_str(str)
end

# eval
def eval_ast(ast, env)
    return case ast
        when Symbol
            raise "'" + ast.to_s + "' not found" if not env.key? ast
            env[ast]
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
    el = eval_ast(ast, env)
    f = el[0]
    return f[*el.drop(1)]
end

# print
def PRINT(exp)
    return pr_str(exp)
end

# repl
repl_env = {:+ => lambda {|a,b| a + b},
            :- => lambda {|a,b| a - b},
            :* => lambda {|a,b| a * b},
            :/ => lambda {|a,b| a / b}}
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
