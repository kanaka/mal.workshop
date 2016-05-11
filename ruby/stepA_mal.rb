require "readline"
require_relative "types"
require_relative "reader"
require_relative "printer"
require_relative "env"
require_relative "core"

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
  while true
    if not ast.is_a? Array
        return eval_ast(ast, env)
    end
    if ast.empty?
        return ast
    end

    # apply list
    a0,a1,a2,a3 = ast
    case a0
    when :def!
        return env.set(a1, EVAL(a2, env))
    when :'let*'
        let_env = Env.new(env)
        a1.each_slice(2) do |a,e|
            let_env.set(a, EVAL(e, let_env))
        end
        env = let_env
        ast = a2 # TCO
    when :do
        eval_ast(ast[1..-2], env)
        ast = ast.last # TCO
    when :if
        cond = EVAL(a1, env)
        if not cond
            return nil if a3 == nil
            ast = a3 # TCO
        else
            ast = a2 # TCO
        end
    when :"fn*"
        return Function.new(a2, a1, env) {|*args|
            EVAL(a2, Env.new(env, a1, Array.new(args)))
        }
    else
        el = eval_ast(ast, env)
        f = el[0]
        if f.class == Function
            ast = f.ast
            env = Env.new(f.env, f.params, el.drop(1)) # TCO
        else
            return f[*el.drop(1)]
        end
    end
  end
end

# print
def PRINT(exp)
    return pr_str(exp)
end

# repl
repl_env = Env.new(nil)

def REP(str, env)
    return PRINT(EVAL(READ(str), env))
end

# core.rb: defined using ruby
$core_ns.each do |k,v| repl_env.set(k,v) end
repl_env.set(:eval, lambda {|ast| EVAL(ast, repl_env)})
repl_env.set(:'*ARGV*', ARGV.slice(1,ARGV.length) || [])
repl_env.set(:'*host-language*', "ruby")

# core.mal: defined using mal itself
REP("(def! not (fn* (a) (if a false true)))", repl_env)
REP("(def! load-file (fn* (f) (eval (read-string (str \"(do \" (slurp f) \")\")))))", repl_env)

if ARGV.size > 0
    REP("(load-file \"" + ARGV[0] + "\")", repl_env)
    exit 0
end

# repl loop
REP("(println (str \"Mal [\" *host-language* \"]\"))", repl_env)
while line = Readline.readline("user> ", true)
    begin
        puts REP(line, repl_env)
    rescue Exception => e
        puts "Error: #{e}"
        puts "\t#{e.backtrace.join("\n\t")}"
    end
end
