# About This Application

This application calculates the probability of winning a tennis match, based on any match format and any current score.

---

## What assumptions does the algorithm make for its calculations?

The accuracy of the algorithm relies on the following assumptions:

- Player 1 has a probability **x** of winning a point when serving and a probability **y** of winning a point on return. These two values are called the **base probabilities**.
- These two probabilities remain constant throughout the entire match.
- Each point is independent of the previous one (the outcome of one point does not affect the probabilities of the following points).

Do not confuse **base probabilities** with **resulting probabilities**.  
The **resulting probabilities** are the values calculated by the algorithm: the probability of winning a game, a set, or the match.

---

## What parameters determine the probability of winning a match?

According to the model, the probability that Player 1 wins the match depends on three user-defined parameters:

1. The **base probabilities** mentioned above, which indicate the chances of winning a point on serve and return.
2. The **match format** (number of sets, number of games per set, presence or absence of a tiebreak in the final set, etc.).
3. The **current score**.

---

## What does the algorithm provide as an output?

Based on the parameters defined above, the algorithm calculates the probability:

- that **Player 1 wins the current game**.
- that **Player 1 wins the current set**.
- that **Player 1 wins the match**.

These three probabilities are referred to as the **resulting probabilities**.

The algorithm also provides the **importance of the next point**, which is the difference between these two values:

- If Player 1 **wins** the next point, what will be their probability of winning the match?
- If Player 1 **loses** the next point, what will be their probability of winning the match?

---

## How does the algorithm perform these calculations?

Once the match format and base probabilities are defined, the algorithm precomputes all **resulting probabilities** for every possible score using **dynamic programming**.

**Advantage:**  
When the user updates the current score, the algorithm updates the resulting probabilities with minimal computation.

**Disadvantage:**  
If the user modifies the base probabilities or match format, all calculations must be redone from scratch. That is why these parameters **cannot be directly modified in the main interface** but must be adjusted through the menu.

**Note:** If you have come across another website with similar functionality that claims to use **Markov chains**, be aware that for this specific problem, it is mathematically equivalent to **dynamic programming**. The algorithm used here is essentially the same and will produce **exactly the same results** for match formats that are supported by that site. The only difference is that this algorithm is far more **flexible** in accommodating various match formats.

---

## Are these calculations realistic for an actual ATP/WTA match?

They are not perfect but provide a good approximation.  
The realism of the model depends on the initial assumptions.

### What is approximated:
- **Are the base probabilities constant?**  
  In reality, they may vary (fatigue, stress, adaptation to the opponent…).
- **Are all points completely independent?**  
  If variations occur due to the above factors, they typically affect multiple consecutive points, creating dependencies between them.

For example, if in the middle of a match, a player is at **15-40** and facing two break points, this likely means something has recently gone wrong (nervousness, physical discomfort, or a sudden surge in the opponent’s confidence…). In this case, assuming that the **same base probabilities** that applied earlier in the match also apply to this specific game may not always be accurate. The actual **break probability** might be slightly **higher** than what the algorithm calculates.  

That said, other factors may sometimes compensate in the opposite direction. For example, certain mentally strong players (e.g., Djokovic) at **15-40** might actually **increase their focus** before serving, which could **reduce** the break probability.

**In summary:**  
The algorithm is **not a perfect** representation of reality but provides an **excellent approximation** of actual probabilities.

---

## What is the purpose of "Game Flow" mode?

If you are following a match live, you can keep this application open in parallel and update the score as the match progresses. In **Editable mode**, the three columns (sets, games, points) must be edited independently. However, in **Game Flow mode**, the interface **automatically detects game/set completions** and shifts any necessary updates to the left column.  

This makes **Game Flow mode** ideal for tracking a match in real time.

During the match, you will see how the **win probabilities evolve** throughout the game. Another interesting aspect is that you can quantify **the importance of each point before it is played**… and see which player performs best in the most crucial moments!

---

