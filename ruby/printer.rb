require_relative "types"

def escape(str)
    str.inspect
end

def pr_str(obj, print_readably=true)
    return case obj
        when Array
            "(" + obj.map{|x| pr_str(x, print_readably)}.join(" ") + ")"
        when String
            if print_readably
                escape(obj) # escape
            else
                obj
            end
        when nil
            'nil'
        when Atom
            '(atom ' + pr_str(obj.value, print_readably) + ')'
        else
            return obj.to_s
    end
end
