class Reader
    def initialize(tokens)
        @position = 0
        @tokens = tokens
    end
    def peek
        return @tokens[@position]
    end
    def next
        @position += 1
        return @tokens[@position-1]
    end
end


def tokenize(str)
    re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/
    return str.scan(re).map{|m| m[0]}.select{ |t|
        t != "" && t[0..0] != ";"
    }
end

def unescape(t) # trim and unescape
    return t.gsub(/\\"/, '"').gsub(/\\n/, "\n").gsub(/\\\\/, "\\")
end

def read_atom(rdr)
    token = rdr.next
    return case token
        when /^-?[0-9]+$/ then       token.to_i   # integer
        when /^".*"$/ then           unescape(token[1..-2]) # string
        when "nil" then              nil
        when "true" then             true
        when "false" then            false
        else                         token.to_sym # symbol
    end
end

def read_list(rdr)
    ast = []
    rdr.next
    while (token = rdr.peek) != ')'
        if token == nil then
            raise "expected ')', got EOF"
        end
        ast.push(read_form(rdr))
    end
    rdr.next
    return ast
end

def read_form(rdr)
    return case rdr.peek
        when "(" then  read_list(rdr)
        when ")" then  raise "unexpected ')'"
        else           read_atom(rdr)
    end
end

def read_str(str)
    tokens = tokenize(str)
    #puts "tokens: #{tokens}"
    return nil if tokens.size == 0
    return read_form(Reader.new(tokens))
end

