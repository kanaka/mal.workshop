require "readline"
require_relative "reader"
require_relative "printer"

# read
def READ(str)
    return read_str(str)
end

# eval
def EVAL(ast, env)
    return ast
end

# print
def PRINT(exp)
    return pr_str(exp)
end

# repl
def REP(str, env)
    return PRINT(EVAL(READ(str), env))
end

# repl loop
while line = Readline.readline("user> ", true)
    begin
        puts REP(line, {})
    rescue Exception => e
        puts "Error: #{e}"
        puts "\t#{e.backtrace.join("\n\t")}"
    end
end
