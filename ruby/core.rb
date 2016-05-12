require_relative "types"
require_relative "reader"
require_relative "printer"

$core_ns = {
    :'=' =>    lambda {|a,b| a ==b},

    :'pr-str' => lambda {|*a| a.map {|e| pr_str(e, true)}.join(" ")},
    :str =>      lambda {|*a| a.map {|e| pr_str(e, false)}.join("")},
    :prn =>      lambda {|*a| puts(a.map {|e| pr_str(e, true)}.join(" "))},
    :println =>  lambda {|*a| puts(a.map {|e| pr_str(e, false)}.join(" "))},
    :'read-string' => lambda {|a| read_str(a)},
    :slurp =>    lambda {|a| File.read(a)},

    :< =>      lambda {|a,b| a < b},
    :<= =>     lambda {|a,b| a <= b},
    :> =>      lambda {|a,b| a > b},
    :>= =>     lambda {|a,b| a >= b},
    :+ =>      lambda {|a,b| a + b},
    :- =>      lambda {|a,b| a - b},
    :* =>      lambda {|a,b| a * b},
    :/ =>      lambda {|a,b| a / b},

    :list =>   lambda {|*a| Array.new a},
    :list? =>  lambda {|a| a.is_a? Array},

    :count =>  lambda {|a| a == nil ? 0 : a.size},
    :empty? => lambda {|a| a.size == 0},

    :atom =>      lambda {|a| Atom.new(a)},
    :atom? =>     lambda {|a| a.is_a? Atom},
    :deref =>     lambda {|a| a.value},
    :reset! =>    lambda {|a,b| a.value = b},
    :swap! =>     lambda {|*a| a[0].value = a[1][*[a[0].value].concat(a.drop(2))]},
}
