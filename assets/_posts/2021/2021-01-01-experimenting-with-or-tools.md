---
title: 'Relationship Formation as an Optimization Problem (Part 1?)'
date: 2021-05-16
author: Xinke Chen
tags:
  - Constraint Satisfaction Problem
  - CSP
  - Theory
  - AI
  - OR-Tools
  - Python
  - Optimization
---

It's been as while since I've updated I figured why not to add a new post? And
with that hamfisted introduction complete, I present the following: Buddy
Pairing as a Constraint Satisfaction Problem (CSP).

## Background

Before I get too carried away at explaining the implementation, let me provide
provide some context. The reason why I am even thinking about human
relationships and constraint optimization in the same thought is that it's tied
to a work project. The project has a very simple goal: Automate the pairing of
new hires and current full time associates together. Now the purposes of having
this pairing exists is to support our new hires by assigning (which the vast
majority are new graduates as well) someone that they can ask questions carte
blanche, anything from how do I use the photocopier (if that actually applied
right now...) to what should I think about for my long term career?

Now, as you probably guessed, any random pairing of new hires to associates
would not do. Ideally, the pairings would be done so that these the buddies
share as many of the same interests and preferences as possible so that both get
the maximal benefit out of the relationship as possible.

Upon learning about the project and hearing that the project needed volunteers,
I almost immediately [nerd-sniped][1] myself in wondering how would you go about
doing that (or at least, in a somewhat elegant manner). And so here we are.

## Intermission for Some Definitions

Before I dive at the heart of the solution I landed on, it probably would be in
my best interest to informally cover what a CSP is. If my very limited search of
Reddit and Hacker News is anything to go by, constraint programming and CSPs are
not exactly a popular topic, and it probably would be foolish to just assume
everyone remembers or knows what a CSP is. Or at least, remembers enough beyond
whatever they needed to pass a Leetcode or HackerRank interview.

So very quickly, Constraint Satisfaction Problem (CSP) is defined simply as a
relation of three elements: variables, domains, and constraints. Now between our
variables, the values in the domains allowable for our variables, and the
constraints governing the variables and domains, there's hopefully some kind of
assignment or configuration of values in said variables that does not violate
the constraints.

Now, in many scenarios, your constraints must always be must always be
satisfied and hold true. So examples of where this applies are like graph
coloring, Sudoku, equation solving, and so forth.

However, for the use case I am working on, it would be a little inconvenient and
impractical to have for a pairing to satisfy all constraints, especially if that
constraint is something as diverse and varied as people's preferences and
interests. After all, what is the likelihood that I was going to always create
pairings where said people shared everything in common?

Ideally, the constraint where the new hire and associate share common interests
and preferences would have to be relaxed, made "soft" if you will. However, I
can not just completely relax the constraint because otherwise we could skip
this who process and do random assignments. So what if for each possible
pairing, we assigned a cost to how much they do not share? So now the model has
become a little more interesting in that it's now a weighted CSP (WCSP). All
that really just means is that now an assignment has an overall cost and as part
of our solution we would like to either minimize or maximize that cost.

## The Semantics

Before we can model anything with a CSP, we need to actually define the problem
we are trying to solve :-). For my particular use case, the requirements were
pretty straightforward, and hence probably why I was actually come up with
something that worked in a relatively straightforward fashion. The constraints
are as follows:

- Pairs have to belong to the same location
- Pairs have to consist of a new hire and associate
- An associate may have multiple new hires assigned to them
- A new hire will only have one associate
- Pairs have to should share as many as the same interests and responses as
  possible

The constraints I actually bother as part of the model/CSP, only the last four
wound up being explicitly defined as part of the model. The first constraint was
just handled as part of the database query that was used to fetch all associates
and new hires. It kept things nice and simple, and did not require me to think
especially hard on how to add that constraint to the model. Plus gives me a nice
easy bonus of being able to parallelize the solving operations over locations.

## The Tool
With the problem defined and a direction to start in, it was now time to turn
theory into code and with that a search for optimization package/tool that will
hopefully let me model this problem without needing me to implement the
algorithms myself.

Now, one interesting wrinkle to the search for such a tool was that it be in a
language that I was both familiar with and is used at the company extensively
and ideally that the team also had experience with and be in the same language
we would build out other components in. And thus began the quixotic search for
an optimization package with a JavaScript interface. Unsurprisingly, I didn't
find much. As it turns out, Javascript is not exactly a popular language for
doing constraint optimization with. I did briefly contemplate on using Node
Native API so I could broaden my search to include tools implemented in C++ but
that would have pretty much guaranteed any solution created would have been
immediately been unmaintainable. 

Fortunately, while contemplating in whether or not to learn how to use the Node
Native API worked and how hard it be to learn how to code with V8, I found
another a tool called [OR-Tools][5]. Maintained by some lovely folk over at
Google, while the core of the package is still implemented in C++, they also
provide a Python interface that's generated with [SWIG][10] from the C++ source.
So not quite what I was looking for, but close enough for my team and I to be
happy.

## And Now, for Something that Did Not Work

Before I just go off and talk about what I wound up implementing, I want to
briefly cover an attempt that did not work. As a matter of opinion, I feel it's
important to cover the path to get here, and show how the solution was not just
preordained.

So the initial implementation I had of modeling the problem did not involve CSPs
and minimizing an objective function, but rather a more naive idea where all the
possible answers and responses were modeled as nodes in a graph, and then for
both new hires and associates would have arcs connected between these answer
nodes and that I would try to form a pairing by maximally matching these nodes
together.

However, some brief research suggested this kind of tripartite matching would be
computationally expensive and time consuming. However, this line of research did
lead down to bipartite matching and learning about how bipartite matching
reduces down to network flow problems. Upon seeing that, I was ecstatic, seeing
as network flow is well covered and there are more than a few libraries out
there, including my target library, OR-Tools that had solvers for this. So the
plan was now to instead to consider a single new hire at a time and find a
maximal matching between the new hire responses and all the full time associates
and utilize the flow computed as the means of picking the best buddy. Sure,
considering a single new hire at a time would probably produce solutions that
were not global optimal, but hey, I just needed an assignment, not a perfect
assignment. Whatever was created would be substantially better that the current
process which was humans going through by hand to create buddy pairs.

Alas, and perhaps thankfully, the idea did not work out; I modeled the solver as
described, ran it, and found that it reported a flow of zero and therefore did
not produce anything useful. Now, I will admit that I did not dissect the reason
as to why seeing as the project was now several weeks in and I needed to get
this out the door, but it boiled down to the following: I made a
number of bad assumptions. In my haste in seeing that the problem could be
reduced to a network flow, I had missed a number of key conditions that allowed
network flow be reducible to an assignment problem.

The core condition I believe is that I did not maintain is where flow heading
into the nodes must the same amount headed out. From doing what I believe the
graph should look like on paper, I saw that I had answer nodes with flow in but
nothing out. This happens as sometimes none of the associates would share some
of the answers that a new hire inputed.  Now, on further reflection, the
solution I believe would have been to add a dummy node that would have
maintained that condition, but I am not entirely sure if would have worked great
in any case. If nothing more, a good lesson in not being too hasty and making
sure I have all the details.

However, now with this approach coming to screeching halt, it was time to think
very hard and come up with a new approach.

## The New Approach

Now stuck with a potential model that did not work, and faced with the prospect
that I might have over-promised a little bit, something occurred to me. I do not
care about the specific answers that each buddy pair share, I just care about to
what degree they do not share the same interests with each other. So instead of
explicitly matching answers from a new hire to associates, what if I instead
compared the answers that a new hire and an associates had, and determine what
interests that the associate does not share with the new hire? In other words,
the set difference between the new hire's answers and the associate answers?

Cue a few days of obsessive tinkering and eureka! I now have a WCSP that
generates useful pairings for me! So the problem/model semantically became the
following:

- The variables are to be all the new hires, each new hire being considered a
  variable
- The domains for each variable/new hire are all the associates that share even
  a single answer with said new hire.
- For each associate/value in the domain for a specific new hire, the cost for
  that assignment to that each new hire/variable is the weighted sum of all the
  answers the associate does not have in common with the new hire
- The objective function we minimize over is simply the sum of the all the costs
  for each assignment of associates to new hires

### Quick Note on the Objective Function

Now this is probably not necessary to explain, but the objective function is
defined as a weighted sum because in the future it would allow users to penalize
differently not having certain answers versus others. So for example, if we did
not want people who like pineapple on pizza to be paired with people who do not
like pineapple on pizza, we could strongly penalizing that assignment by
changing the associated cost with that answer or question.

A small implementation detail: the cost I assigned to my problems are all
of type integer. It's partially for simplicity (like, what would a weight of 1.5
vs 2 get you?), and also because for many of the solvers in OR-Tools, it's a
requirement that your values are either representable as a boolean or integer
value. If you find yourself wanting floating point values, do what this nice
[StackOverflow Answer][2] says to do and just scale your values. Bonus is you do
not have to worry about the effects of floating point precision in evaluating an
optimal solution.

Final note about the objective function is that the choice to minimize versus
maximize was an arbitrary choice and influenced by convention. You can easily
define the objective function to use the set intersection of the new hire and
associates answers and maximize the "cost". I just choose to minimize my
objective function because a lot of literature and examples just often talk
about minimizing the objective/cost/loss function

### Quick Aside about OR-Tools Performance

With a working implementation in hand, one big question I did have to address
was the performance of model, specifically how long it takes to solve as the
number of new hires and associates increase? After all, I do have to deploy this
to production, and end-users should not have to wait hours to get a result.
Initial testing with mock data of ten new hires and seventeen associates did not
yield promising news; in fact, even if I gave the model an hour to solve, it
only found feasible solutions, not optimal ones. Sure, the model did create an
assignment that pairs everyone, and for our purposes probably would've been okay
since this was a completely manual process before this, but it still was
disappointing to see.

Fortunately, I found out, in a circuitous manner, that the [CP-SAT solver][8]
supported [multi-threading][3]. As part of the solver setup, you set a parameter
called `solver.sat.num_search_workers` to tell it how many workers you want
(eight was the number often suggested in threads on the [OR-Tools Forums][7] )
and boom, it made the solver go from hours and only feasible solutions to tenths
of seconds and optimal solutions. Probably will be one of the few times in my
career where the phrase "let's use multithreading!" and not have it immediately
complicate matters. Helps that I did not do any of the hard work, the fine
people over at [OR-Tools][5] did. Granted, the production data would be larger
still, but not significantly so. Will be interesting to see how well it all
scales out.

Now, there is no such thing as a free lunch and as such, there are limitations.
One, the solver does become non-deterministic. As highlighted in the [release
notes][4], it uses randomization to set different parameters and is something to
be aware of. Another thing to be aware of is that the multi-threaded solver, as
of time of writing, does not support finding of all solutions. For my
application, these two limitations did not concern me since I only need a
solution, but your mileage may vary.

## Conclusion

All in all, I've really enjoyed my time working on this project. Granted, this
problem is not particularly hard, as evidenced by the fact I did not need to
spend weeks banging my head against the wall trying to make the problem
workable. On the bright side, I do get to say that I actually used what I am
learned in degree in my job, a mildly interesting and also completely
unimportant distinction to have.

Now, if you want to try this yourself, the assignment problem [example][6] and
the nurse scheduling [example][9] I found exceptionally useful. The final code
output, while not shown here, is extremely similar to the examples; the
assignment example being useful in learning how to define a model and the
nurse's example was useful in demonstrating a more involved setup. The only real
differences were a lot of utility functions to dynamically compute the cost
(really, figuring out how to create the correct database MongoDB queries); that
and a bit of work to create a multi-key/bidirectional data structure that let me
use said data structure both like a list and dictionary at the same time.

As for the outcome of the project and it's future, I've already gotten a few
chances to use it for real at the expected dataset sizes and the tool has
performed admirably and the team has gotten useful feedback on the pairing
process and the overall product and as such, the work continues.

[1]: https://xkcd.com/356/
[2]: https://or.stackexchange.com/questions/3325/floating-points-in-ortools
[3]: https://developers.google.com/optimization/support/release_notes?hl=en#new-options-for-the-cp-sat-solver
[4]: https://developers.google.com/optimization/support/release_notes#announcing-release-of-version-v6.8
[5]: https://developers.google.com/optimization
[6]: https://developers.google.com/optimization/assignment/assignment_example
[7]: https://groups.google.com/g/or-tools-discuss
[8]: https://developers.google.com/optimization/cp/cp_solver
[9]: https://developers.google.com/optimization/scheduling/employee_scheduling
[10]: http://swig.org/
