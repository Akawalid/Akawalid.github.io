window.projects = [
  {
    slug: "onera-challenge",
    type: "research",
    title: {
      en: "Scientific Machine Learning Challenge on Codabench",
      fr: "Défi d'apprentissage automatique scientifique sur Codabench",
      kab: "Asenfar n Almmud Ussnan n Tmacinin ɣef Codabench"
    },
    period: { en: "May - Aug 2026", fr: "Mai - Août 2026", kab: "Mayyu - Ɣuct 2026" },
    lab: {
      en: "LISN, University of Paris-Saclay",
      fr: "LISN, Université Paris-Saclay",
      kab: "LISN, Tasdawit n Paris-Saclay"
    },
    supervisors: "Lisheng Sun, Sylvain Chevallier, Jacques Peter, Jean-Luc Hantrais-Gervois",
    summary: {
      en: "Scientific machine learning challenge based on RANS CFD simulations, featured in DataCamp 2027.",
      fr: "Défi d'apprentissage automatique scientifique basé sur des simulations CFD RANS, présenté à DataCamp 2027.",
      kab: "Asenfar n almmud ussnan n tmacinin ɣef adigan n RANS CFD, ad yettwabeggen deg DataCamp 2027."
    },
    description: {
      en: "Supervised by Lisheng Sun, Sylvain Chevallier, Jacques Peter and Jean-Luc Hantrais-Gervois, designed a scientific machine learning challenge based on Reynolds-Averaged Navier-Stokes Computational Fluid Dynamics simulations. The challenge will be featured in the 2027 edition of DataCamp. Also worked on side projects involving Gromo, the tau team's package for growing neural networks.",
      fr: "Encadré par Lisheng Sun, Sylvain Chevallier, Jacques Peter et Jean-Luc Hantrais-Gervois, conception d'un défi d'apprentissage automatique scientifique basé sur des simulations Reynolds-Averaged Navier-Stokes de mécanique des fluides numérique. Le défi sera présenté lors de l'édition 2027 de DataCamp. A également travaillé sur des projets annexes autour de Gromo, le package de l'équipe tau pour la croissance de réseaux de neurones.",
      kab: "Ittwasenced sɣur Lisheng Sun, Sylvain Chevallier, Jacques Peter akked Jean-Luc Hantrais-Gervois, heggaɣ asenfar n almmud ussnan n tmacinin ɣef adigan n RANS CFD (Reynolds-Averaged Navier-Stokes). Asenfar-a ad yili deg DataCamp n 2027. Xedmeɣ daɣen ɣef isenfaren nniḍen s Gromo, apaket n tarbaɛt tau i tmernit n yiẓran imassaniyen."
    },
    details: {
      en: [
        "Given the flight conditions of an unseen simulation — Mach number, angle of attack, and stagnation pressure — the challenge is to predict the volumetric density at each of 260,774 points on the surface of ONERA's Common Research Model (CRM) aircraft. As aircraft approach the speed of sound, compressibility effects make the local air density vary sharply from point to point, producing shock waves that are hard to predict.",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/flow_separation.jpg", alt: "Flow separation at extreme angles of attack, one of the flow phenomena the challenge targets" },
        "The database contains 468 RANS CFD simulations (Spalart-Allmaras turbulence model) on a fixed wing-body-pylon-nacelle geometry (below); only the flow conditions vary between simulations. The train/test split runs along the Mach number axis: training covers Mach 0.50-0.93, phase 1 tests interpolation (0.84, 0.86), and phase 2 tests extrapolation to the lowest and highest Mach numbers in the dataset (0.30 and 0.96).",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/fig_components_CRM.png", alt: "Wing, body, pylon and nacelle components of the CRM aircraft geometry" },
        "For each test simulation, the pointwise prediction errors form an empirical distribution $P^f$. The primary ranking metric compares that distribution to a centered reference Gaussian $Q^f = \\mathcal{N}(0,\\, 0.1\\,\\sigma_{\\rho^f})$ via the Kullback-Leibler divergence:\n$$KL^f = D_{KL}(P^f \\,\\|\\, Q^f) = \\int_{-\\infty}^{+\\infty} p(x) \\log \\frac{p(x)}{q(x)} \\, dx$$\nA distribution with more than one peak, or a peak offset from zero, means the model is biased on a specific region of the aircraft rather than just noisy — exactly what this metric penalizes.",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/bimodal.svg", alt: "A bimodal error distribution: the kind of local bias the KL-divergence metric penalizes" },
        "Two secondary metrics add context: the coefficient of determination $R^2$, and the worst-case relative error across well-converged simulations,\n$$rMAE^f = \\frac{\\sum_{i=1}^{n_p} |\\rho_i^f - \\hat{\\rho}_i^f|}{\\sum_{i=1}^{n_p} |\\rho_i^f|} \\qquad\\qquad wrMAE = \\max_{f \\in \\mathcal{W}} rMAE^f$$\nwhere $n_p = 260{,}774$ is the number of surface points and $\\mathcal{W}$ is the set of well-converged test simulations."
      ],
      fr: [
        "Étant donné les conditions de vol d'une simulation inédite — nombre de Mach, angle d'attaque et pression d'arrêt — le défi consiste à prédire la densité volumique en chacun des 260 774 points de la surface de l'avion CRM (Common Research Model) d'ONERA. À l'approche de la vitesse du son, les effets de compressibilité font varier fortement la densité locale de l'air d'un point à l'autre, produisant des ondes de choc difficiles à prédire.",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/flow_separation.jpg", alt: "Décollement de l'écoulement à angle d'attaque extrême, l'un des phénomènes visés par le défi" },
        "La base de données contient 468 simulations CFD RANS (modèle de turbulence Spalart-Allmaras) sur une géométrie fixe voilure-fuselage-mât-nacelle (ci-dessous) ; seules les conditions d'écoulement varient d'une simulation à l'autre. La séparation train/test se fait selon l'axe du nombre de Mach : l'entraînement couvre Mach 0,50-0,93, la phase 1 teste l'interpolation (0,84, 0,86), et la phase 2 teste l'extrapolation vers les nombres de Mach les plus bas et les plus hauts du jeu de données (0,30 et 0,96).",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/fig_components_CRM.png", alt: "Composants voilure, fuselage, mât et nacelle de la géométrie CRM" },
        "Pour chaque simulation de test, les erreurs de prédiction en chaque point forment une distribution empirique $P^f$. La métrique principale de classement compare cette distribution à une gaussienne de référence centrée $Q^f = \\mathcal{N}(0,\\, 0.1\\,\\sigma_{\\rho^f})$ via la divergence de Kullback-Leibler :\n$$KL^f = D_{KL}(P^f \\,\\|\\, Q^f) = \\int_{-\\infty}^{+\\infty} p(x) \\log \\frac{p(x)}{q(x)} \\, dx$$\nUne distribution avec plus d'un pic, ou un pic décalé de zéro, signifie que le modèle est biaisé sur une région précise de l'avion plutôt que simplement bruité — exactement ce que pénalise cette métrique.",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/bimodal.svg", alt: "Une distribution d'erreur bimodale : le type de biais local pénalisé par la divergence KL" },
        "Deux métriques secondaires apportent du contexte : le coefficient de détermination $R^2$, et l'erreur relative dans le pire des cas parmi les simulations bien convergées,\n$$rMAE^f = \\frac{\\sum_{i=1}^{n_p} |\\rho_i^f - \\hat{\\rho}_i^f|}{\\sum_{i=1}^{n_p} |\\rho_i^f|} \\qquad\\qquad wrMAE = \\max_{f \\in \\mathcal{W}} rMAE^f$$\noù $n_p = 260{,}774$ est le nombre de points de surface et $\\mathcal{W}$ l'ensemble des simulations de test bien convergées."
      ],
      kab: [
        "Ɣef tegnitin n uferfer n tiskilt ur nettwaẓra ara — tawda n tikkelt (Mach), tabzimt n unekcum, lḍeɣtt n ubeddu — asenfar issuter tanadant n tɣezdemt n uẓekka ɣef 260.774 n tenqiḍin n tsura n uɛeṭṭaf CRM n ONERA. Mi aɛeṭṭaf iqeṛṛeb ɣer twada n imesli, tɣezdemt n waḍu tettbeddil s waṭas seg umḍiq ɣer wayeḍ, isuffɣen ivuɣan uɛeṛ ad ttwabnun.",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/flow_separation.jpg", alt: "Amfaṛeq n tɣezdemt deg tebzimin tuggarin, yiwet seg tegnitin i d-yeqsed asenfar" },
        "Tabazint n yisefka tesɛa 468 n tiskilin CFD RANS (amudel Spalart-Allmaras) ɣef tbenyi tumḍint (ddaw-a); kan tignitin n tɣezdemt i yettbeddilen. Aẓawan gar uheggi d uɛeqqeb ittwag s telɣa n Mach: aheggi yesɛa Mach seg 0.50 ar 0.93, tazwara (phase 1) tesɛeddi interpolation, tiss-snat (phase 2) tesɛeddi extrapolation ɣer telɣatin idurar (0.30 akked 0.96).",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/fig_components_CRM.png", alt: "Iḥricen n tbenyi CRM: afeṛṛug, aɛeṭṭaf, tanaḍit d unaẓur" },
        "I yal tiskilt n uɛeqqeb, tuccḍiwin deg yal tanqiḍt sɣersent tuɣzi tamassant $P^f$. Tasertit tagejdant tettmuqul tuɣzi-ya ɣer gaussienne yellan deg wammas $Q^f = \\mathcal{N}(0,\\, 0.1\\,\\sigma_{\\rho^f})$ s divergence n Kullback-Leibler:\n$$KL^f = D_{KL}(P^f \\,\\|\\, Q^f) = \\int_{-\\infty}^{+\\infty} p(x) \\log \\frac{p(x)}{q(x)} \\, dx$$\nTuɣzi s ugar n yiwen wallun, neɣ allun ur nelli ara ɣef walu, tettbeggin belli amudel yesɛa lɣelḍ ɣef tama tarẓift n uɛeṭṭaf, mačči kan aẓayan — d ayen i tettqadar tsertit-a.",
        { img: "https://raw.githubusercontent.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2/main/bundle/pages/figures/bimodal.svg", alt: "Tuɣzi n tuccḍa s sin wallunen: anaw n lɣelḍ i tettqadar tsertit KL" },
        "Snat tsertiyin tiss-snat ttarnint talɣut: afaris n uɣtas $R^2$, akked tuccḍa tarẓift tuggarin gar tiskilin iɣellin,\n$$rMAE^f = \\frac{\\sum_{i=1}^{n_p} |\\rho_i^f - \\hat{\\rho}_i^f|}{\\sum_{i=1}^{n_p} |\\rho_i^f|} \\qquad\\qquad wrMAE = \\max_{f \\in \\mathcal{W}} rMAE^f$$\nanda $n_p = 260{,}774$ d amḍan n tenqiḍin n tsura, $\\mathcal{W}$ d taggayt n tiskilin iɣellin mliḥ."
      ]
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/onera_468_crm_wall_distribution_regression_challenge_v2" },
      { label: "Codabench", url: "https://www.codabench.org/competitions/17632/" },
      { label: "Paper", url: "https://arxiv.org/abs/2505.06265" }
    ],
    images: []
  },
  {
    slug: "equivariant-gnn",
    type: "research",
    title: {
      en: "Equivariant Neural Networks for Glassy Liquids",
      fr: "Réseaux de neurones équivariants pour les liquides vitreux",
      kab: "Iẓran Imassaniyen Iwdanen (Equivariant) i Waman Idusan (Glassy Liquids)"
    },
    period: { en: "Jan - Apr 2026", fr: "Janv. - Avr. 2026", kab: "Yennayer - Yebrir 2026" },
    lab: {
      en: "LISN, University of Paris-Saclay",
      fr: "LISN, Université Paris-Saclay",
      kab: "LISN, Tasdawit n Paris-Saclay"
    },
    supervisors: "François Landes",
    summary: {
      en: "Bayesian hyperparameter search on SE(3)-equivariant graph neural networks to predict dynamical propensity.",
      fr: "Recherche bayésienne d'hyperparamètres sur des réseaux de neurones de graphes équivariants SE(3) pour prédire la propension dynamique.",
      kab: "Anadi bayesian n hyperparameters ɣef iẓran n ugraf udmawan SE(3) i usenqed n tɣara tanmegant."
    },
    description: {
      en: "Supervised by François Landes, performed a Bayesian hyperparameter search on SE(3)-equivariant graph neural networks using DeepHyper to predict dynamical propensity in glassy liquids, on the Kob-Andersen molecular dynamics dataset. The work involved tuning the spherical-harmonic degree, layer count and channel schedules, as well as extending the hyperparameter search space by digging into the model's representation theory.",
      fr: "Encadré par François Landes, réalisation d'une recherche bayésienne d'hyperparamètres sur des réseaux de neurones de graphes équivariants SE(3) avec DeepHyper, pour prédire la propension dynamique de liquides vitreux sur le jeu de données de dynamique moléculaire Kob-Andersen. Le travail a consisté à ajuster le degré des harmoniques sphériques, le nombre de couches et les canaux, ainsi qu'à étendre l'espace de recherche en s'appuyant sur la théorie des représentations du modèle.",
      kab: "Ittwasenced sɣur François Landes, xedmeɣ anadi bayesian n hyperparameters ɣef iẓran n ugraf udmawan SE(3), s DeepHyper, i usenqed n tɣara tanmegant deg waman idusan, ɣef yisefka n Kob-Andersen. Axeddim-a yesɛa asswizzel n addad n spherical harmonics, amḍan n tissiliwin akked ubrid n izuran, akked usɣeṛɣer n umḍiq n unadi s ubḥeṛ deg tsertit n uskan n umudel."
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/equivariant_neural_networks_research_project" }
    ],
    images: []
  },
  {
    slug: "rust-verification",
    type: "research",
    title: {
      en: "Formal Verification of Rust Programs (Creusot)",
      fr: "Vérification formelle de programmes Rust (Creusot)",
      kab: "Aselqed Unṣib n Isefka Rust (Creusot)"
    },
    period: { en: "May - Jul 2025", fr: "Mai - Juil. 2025", kab: "Mayyu - Yulyu 2025" },
    lab: {
      en: "Laboratory of Formal Methods, Gif-sur-Yvette",
      fr: "Laboratoire Méthodes Formelles, Gif-sur-Yvette",
      kab: "Laboratoire Méthodes Formelles, Gif-sur-Yvette"
    },
    supervisors: "Jean-Christophe Filliatre, Arnaud Golfouse, Paul Patault",
    summary: {
      en: "Formal verification of Rust programs using the Creusot tool.",
      fr: "Vérification formelle de programmes Rust à l'aide de l'outil Creusot.",
      kab: "Aselqed unṣib n isefka Rust s ufecku Creusot."
    },
    description: {
      en: "Supervised by Jean-Christophe Filliatre, Arnaud Golfouse and Paul Patault, formal verification of Rust programs with the Creusot tool.",
      fr: "Encadré par Jean-Christophe Filliatre, Arnaud Golfouse et Paul Patault, vérification formelle de programmes Rust avec l'outil Creusot.",
      kab: "Ittwasenced sɣur Jean-Christophe Filliatre, Arnaud Golfouse akked Paul Patault, aselqed unṣib n isefka Rust s ufecku Creusot."
    },
    details: {
      en: [
        "The centerpiece of the internship is reverse_in_place: an in-place, O(1)-extra-space reversal of a singly-linked list built from raw pointers rather than Rust's usual safe references — the kind of code the borrow checker can't reason about on its own, which is exactly why Creusot is needed. The diagrams below are redrawn from my internship report at LMF's Toccata team; each one documents a step of the path from that plain, unverified Rust function to the fully proved reverse_in_place, and how it fits into the verification landscape around Creusot.",
        { img: "images/creusot-toolchain.png", alt: "How Creusot sits among Rust and separation-logic verifiers: it compiles Rust to an intermediate language, Coma, discharged by Why3's SMT backend. Neither Coma nor Why3 has a built-in notion of separation logic. Prusti, a different Rust verifier, instead goes through Viper and Boogie, which do support it natively." },
        "The practical consequence: since Creusot has no separation logic of its own, any argument that would normally live in separation logic — “this pointer's cells don't overlap with that one's” — has to be smuggled in another way. Creusot does it by leaning on Rust's own ownership and borrowing rules through ghost code, which is the whole reason the PtrOwn type exists.",
        "To see why that smuggling is needed, consider reversing a list that shares nodes with another list — say α = [1,2,3] and β = [4,5,3], sharing node 3. A naive specification for in-place reversal might promise: given list p α, produce list p ᾱ, the reversed sequence. That looks right, but on its own it says nothing about what happens to β, which points into the middle of what just got reversed.",
        { img: "images/creusot-shared-lists.png", alt: "Reversing α in place when it shares its tail with β: the naive contract list p α / list p ᾱ says nothing about what happens to the shared cells 2 and 3, or to β, which still points into the middle of what just got reversed." },
        "Real Rust code can't actually corrupt β this way — the type system already guarantees no two live pointer chains alias badly enough to cause it without admitting unsafe code. But a from-scratch formal specification doesn't know that automatically; it has to be told, and that is separation logic's job: reasoning about disjoint parts of the heap so a change to one part provably leaves the other untouched. Creusot has no native separation logic, so the proof reconstructs that guarantee by hand, through ownership.",
        { code: "pub struct Node<T> {\n    elem: T,\n    pub next: RawPtr<Node<T>>,\n}\n\n#[predicate]\n#[variant(perm_seq.len())]\nfn list(l: RawPtr<Self>, perm_seq: Seq<PtrOwn<Node<T>>>) -> bool {\n    pearlite! {\n        if l.is_null_logic() {\n            perm_seq.len() == 0\n        } else if perm_seq.len() > 0 {\n            let ptr = perm_seq[0].ptr();\n            l == ptr && Self::list(perm_seq[0].val().next, perm_seq.tail())\n        } else {\n            false\n        }\n    }\n}", caption: "The list predicate: a raw pointer l, together with a ghost sequence of owned cells perm_seq, really does form a well-formed linked list." },
        "list is the load-bearing definition of the whole proof. A raw pointer alone carries no guarantee that it points at a valid, alive Node — Creusot can't see through raw pointers the way it can through &T. The PtrOwn sequence supplies that missing guarantee: each PtrOwn is a ghost witness that its holder exclusively owns one heap cell, and list recursively checks that the pointer, the head of the sequence, and the rest of the chain all agree.",
        { img: "images/creusot-ptrown-structure.png", alt: "The internal shape of PtrOwn<T>: in the ghost world it bundles a ptr field (a RawPtr<T>) with a val field (the actual node value). Several RawPtr<T> copies in the program world can equal that same ptr, but only PtrOwn certifies exclusive ownership of the cell it points to — a bare RawPtr is just an address, with no such guarantee." },
        "That is precisely the gap list closes: a RawPtr<T> is just a number that looks like an address, so Creusot's logic cannot tell a dangling or aliased pointer from a valid one by looking at it alone. Holding a PtrOwn is the ghost-world witness that the corresponding memory cell really is live and exclusively owned — exactly the guarantee needed to chain safely from one node to the next.",
        { img: "images/creusot-list-memory.png", alt: "A 4-node list p → v1 → v2 → v3 → v4 → nil as list actually checks it: each program-world RawPtr in the chain (top) is matched one-to-one against a PtrOwn entry in the ghost sequence perm_seq (bottom), and each PtrOwn's own ptr field points back at that very same node." },
        "list(l, perm_seq) holds exactly when this picture is accurate: walking the real pointer chain and walking the ghost sequence in lock-step lands on the same nodes at every position, until both run out together — a null pointer paired with an empty sequence. That lock-step correspondence is what reverse_in_place's precondition and postcondition both demand, once before the function runs and once after.",
        { code: "#[requires(Self::list(p, **seq))]\n#[ensures(Self::list(result, *^seq))]\n#[ensures(seq.len() == (^seq).len())]\n#[ensures(Self::inverse(**seq, *^seq, 0, (*^seq).len()))]\npub fn reverse_in_place(\n    mut p: RawPtr<Self>,\n    seq: &mut Ghost<Seq<PtrOwn<Node<T>>>>,\n) -> RawPtr<Self>", caption: "reverse_in_place's contract." },
        "The precondition just says: p, together with the ghost ownership sequence seq, is a well-formed list — matches the picture above. The postconditions are the actual correctness statement — the returned pointer is again a well-formed list (nothing corrupted); the sequence has the same length before and after (no cell created or lost); and, the real content of “reversed”, inverse holds between the old and new sequences: element i counted from the end of the new list is element i from the start of the old one, for every index.",
        { code: "#[invariant(Self::list(q, *reverted_seq))]\n#[invariant(Self::list(p, **seq))]\n#[invariant(Self::inverse(\n    _seq0.subsequence(0, reverted_seq.len()),\n    *reverted_seq, 0, reverted_seq.len()\n))]\n#[invariant(reverted_seq.len() + seq.len() == _seq0.len())]\n#[invariant(**seq == _seq0.subsequence(reverted_seq.len(), _seq0.len()))]\nwhile !p.is_null() { ... }", caption: "The loop invariants, carrying the proof one node at a time." },
        { img: "images/creusot-invariant-memory.png", alt: "Memory mid-loop, matching q/reverted_seq and p/seq in the code: the left half (already reversed) has v1 now pointing to nil and v2 now pointing back to v1 — the two nodes swapped so far; the right half (untouched) still has v3 pointing to v4 pointing to nil, exactly as in the original list." },
        "Each pass through the loop moves one cell from the untouched pointer p to the already-reversed pointer q, producing exactly the split the diagram shows. The five invariants keep the whole argument true at every such step: the reversed-so-far part (q, reverted_seq) is itself a well-formed list; the untouched remainder (p, seq) still is too; reverted_seq really is the reverse of the matching prefix of the original list; no cell is ever created or dropped, since the two parts' lengths always sum to the original length; and the untouched part is always exactly the corresponding suffix of the original sequence. seq shrinks by one cell each iteration and the loop stops the moment p is null, so the traversal terminates — and by then, reverted_seq is the reverse of the entire original list, exactly as the postcondition promised.",
        "reverse_in_place is the one module wired into lib.rs and fully proved; the rest of the repository — a Morris in-order tree traversal, heapsort, insertion sort, binary search, and a few others — are internship exercises kept as comments, worked through but not all carried to a finished proof."
      ],
      fr: [
        "La pièce maîtresse du stage est reverse_in_place : un renversement en place, sans espace supplémentaire, d'une liste chaînée simple construite avec des pointeurs bruts plutôt que les références sûres habituelles de Rust — exactement le genre de code que le borrow checker ne peut pas analyser seul, d'où le recours à Creusot. Les schémas ci-dessous sont repris de mon rapport de stage au sein de l'équipe Toccata du LMF ; chacun documente une étape du chemin entre cette fonction Rust ordinaire, non vérifiée, et le reverse_in_place entièrement prouvé, ainsi que sa place dans le paysage des outils de vérification autour de Creusot.",
        { img: "images/creusot-toolchain.png", alt: "Où se situe Creusot parmi Rust et les vérificateurs à logique de séparation : il compile Rust vers un langage intermédiaire, Coma, déchargé par le moteur SMT de Why3. Ni Coma ni Why3 n'ont de notion native de logique de séparation. Prusti, un autre vérificateur Rust, passe au contraire par Viper et Boogie, qui la supportent nativement." },
        "Conséquence pratique : comme Creusot n'a pas de logique de séparation propre, tout argument qui relèverait normalement de la logique de séparation — « les cellules de ce pointeur ne recouvrent pas celles de cet autre » — doit être introduit d'une autre manière. Creusot le fait en s'appuyant sur les règles de possession et d'emprunt propres à Rust, via le code fantôme (ghost code), ce qui est précisément la raison d'être du type PtrOwn.",
        "Pour voir pourquoi ce contournement est nécessaire, imaginons le renversement d'une liste qui partage des nœuds avec une autre — disons α = [1,2,3] et β = [4,5,3], partageant le nœud 3. Une spécification naïve du renversement en place pourrait promettre : à partir de list p α, produire list p ᾱ, la séquence renversée. Cela semble correct, mais à elle seule cette spécification ne dit rien de ce qui arrive à β, qui pointe au milieu de ce qui vient d'être renversé.",
        { img: "images/creusot-shared-lists.png", alt: "Renverser α en place lorsqu'elle partage sa fin avec β : le contrat naïf list p α / list p ᾱ ne dit rien de ce qui arrive aux cellules partagées 2 et 3, ni à β, qui pointe toujours au milieu de ce qui vient d'être renversé." },
        "Du vrai code Rust ne peut en réalité pas corrompre β de cette façon — le système de types garantit déjà qu'aucune paire de chaînes de pointeurs actives ne peut s'aliaser assez mal pour causer cela sans passer par du code unsafe qui l'admet explicitement. Mais une spécification formelle écrite de zéro ne le sait pas automatiquement ; il faut le lui dire, et c'est précisément le rôle de la logique de séparation : raisonner sur des parties disjointes du tas pour qu'un changement dans l'une laisse prouvablement l'autre intacte. Creusot n'a pas de logique de séparation native, donc la preuve reconstruit cette garantie à la main, par la possession.",
        { code: "pub struct Node<T> {\n    elem: T,\n    pub next: RawPtr<Node<T>>,\n}\n\n#[predicate]\n#[variant(perm_seq.len())]\nfn list(l: RawPtr<Self>, perm_seq: Seq<PtrOwn<Node<T>>>) -> bool {\n    pearlite! {\n        if l.is_null_logic() {\n            perm_seq.len() == 0\n        } else if perm_seq.len() > 0 {\n            let ptr = perm_seq[0].ptr();\n            l == ptr && Self::list(perm_seq[0].val().next, perm_seq.tail())\n        } else {\n            false\n        }\n    }\n}", caption: "Le prédicat list : un pointeur brut l, muni d'une séquence fantôme de cellules possédées perm_seq, forme bien une liste chaînée valide." },
        "list est la définition sur laquelle repose toute la preuve. Un pointeur brut seul ne garantit rien — Creusot ne peut pas voir à travers un pointeur brut comme il le fait pour une référence &T. La séquence de PtrOwn apporte cette garantie manquante : chaque PtrOwn est un témoin fantôme attestant que son détenteur possède exclusivement une cellule du tas, et list vérifie récursivement que le pointeur, la tête de la séquence et le reste de la chaîne concordent.",
        { img: "images/creusot-ptrown-structure.png", alt: "La forme interne de PtrOwn<T> : dans le monde fantôme, il regroupe un champ ptr (un RawPtr<T>) et un champ val (la valeur réelle du nœud). Plusieurs copies de RawPtr<T> dans le monde du programme peuvent être égales à ce même ptr, mais seul PtrOwn certifie la possession exclusive de la cellule qu'il désigne — un simple RawPtr n'est qu'une adresse, sans cette garantie." },
        "C'est exactement le manque que list comble : un RawPtr<T> n'est qu'un nombre qui ressemble à une adresse, la logique de Creusot ne peut donc pas distinguer, en le regardant seul, un pointeur pendouillant ou aliasé d'un pointeur valide. Détenir un PtrOwn est le témoin, dans le monde fantôme, que la cellule mémoire correspondante est bien vivante et possédée exclusivement — exactement la garantie nécessaire pour enchaîner en toute sécurité d'un nœud au suivant.",
        { img: "images/creusot-list-memory.png", alt: "Une liste à 4 nœuds p → v1 → v2 → v3 → v4 → nil telle que list la vérifie réellement : chaque RawPtr du monde du programme dans la chaîne (en haut) est mis en correspondance un-à-un avec une entrée PtrOwn de la séquence fantôme perm_seq (en bas), et le champ ptr de chaque PtrOwn repointe vers ce même nœud." },
        "list(l, perm_seq) est vrai exactement quand cette image est fidèle : parcourir la vraie chaîne de pointeurs et parcourir la séquence fantôme au même rythme tombe sur les mêmes nœuds à chaque position, jusqu'à ce que les deux s'arrêtent ensemble — un pointeur nul associé à une séquence vide. Cette correspondance au même rythme est exactement ce qu'exigent la précondition et la postcondition de reverse_in_place, une fois avant l'exécution de la fonction et une fois après.",
        { code: "#[requires(Self::list(p, **seq))]\n#[ensures(Self::list(result, *^seq))]\n#[ensures(seq.len() == (^seq).len())]\n#[ensures(Self::inverse(**seq, *^seq, 0, (*^seq).len()))]\npub fn reverse_in_place(\n    mut p: RawPtr<Self>,\n    seq: &mut Ghost<Seq<PtrOwn<Node<T>>>>,\n) -> RawPtr<Self>", caption: "Le contrat de reverse_in_place." },
        "La précondition dit simplement : p, avec la séquence fantôme de propriété seq, forme une liste valide — conforme à l'image ci-dessus. Les postconditions constituent la véritable preuve de correction : le pointeur retourné forme de nouveau une liste valide (rien n'est corrompu) ; la séquence a la même longueur avant et après (aucune cellule créée ou perdue) ; et, le cœur du mot « renversé », inverse relie l'ancienne et la nouvelle séquence : l'élément i compté depuis la fin de la nouvelle liste est l'élément i depuis le début de l'ancienne, pour chaque indice.",
        { code: "#[invariant(Self::list(q, *reverted_seq))]\n#[invariant(Self::list(p, **seq))]\n#[invariant(Self::inverse(\n    _seq0.subsequence(0, reverted_seq.len()),\n    *reverted_seq, 0, reverted_seq.len()\n))]\n#[invariant(reverted_seq.len() + seq.len() == _seq0.len())]\n#[invariant(**seq == _seq0.subsequence(reverted_seq.len(), _seq0.len()))]\nwhile !p.is_null() { ... }", caption: "Les invariants de boucle, qui portent la preuve nœud par nœud." },
        { img: "images/creusot-invariant-memory.png", alt: "La mémoire au milieu de la boucle, correspondant à q/reverted_seq et p/seq dans le code : la moitié déjà renversée (à gauche) a v1 qui pointe maintenant vers nil et v2 qui pointe en retour vers v1 — les deux nœuds échangés jusqu'ici ; la moitié non traitée (à droite) a toujours v3 qui pointe vers v4 qui pointe vers nil, exactement comme dans la liste d'origine." },
        "À chaque tour de boucle, une cellule passe du pointeur non traité p au pointeur déjà renversé q, produisant exactement la répartition que montre le schéma. Les cinq invariants maintiennent tout l'argument vrai à chaque étape : la partie déjà renversée (q, reverted_seq) est elle-même une liste valide ; le reste non traité (p, seq) l'est encore aussi ; reverted_seq est bien l'inverse du préfixe correspondant de la liste d'origine ; aucune cellule n'est jamais créée ni perdue, puisque les longueurs des deux parties s'additionnent toujours pour donner la longueur d'origine ; et la partie non traitée est toujours exactement le suffixe correspondant de la séquence d'origine. seq perd une cellule à chaque itération et la boucle s'arrête dès que p est nul, donc le parcours termine — et à ce moment-là, reverted_seq est bien l'inverse de toute la liste d'origine, exactement ce que promettait la postcondition.",
        "reverse_in_place est le seul module câblé dans lib.rs et entièrement prouvé ; le reste du dépôt — un parcours infixe de Morris, un tri par tas, un tri par insertion, une recherche binaire et quelques autres — sont des exercices de stage laissés en commentaire, travaillés mais pas tous menés jusqu'à une preuve complète."
      ],
      kab: [
        "Axeddim agejdan n telemmist d reverse_in_place: asemseɣti deg umkan-is n tebdart yeqqnen s tikkelt (linked list), yebnan ɣef pointers ur nettwaḥrez ara sɣur Rust, mačči ɣef tirawin isɛan laman. Ttuɣal-tt Creusot ilaq. Ijjufaf i d-yellan sdaw sɛeddant seg urapport n telemmist-iw deg tarbaɛt Toccata n LMF; yal ijjaf yesbeggen amecwaṛ seg twuri Rust taḥerrayt ur nettwabeṭṭen ara ɣer reverse_in_place ittwabeṭṭen s telqayt akmal, akked wemḍiq-is deg tmezzugt n ifecka n uselqed ɣer tama n Creusot.",
        { img: "images/creusot-toolchain.png", alt: "Amḍiq n Creusot ger Rust akked isefranen n separation logic: yesuqqel Rust ɣer tutlayt talemmast, Coma, ittwaselken s uswir SMT n Why3. Ur Coma ur Why3 ur sɛin talɣa tlelli n separation logic. Prusti, aseflan Rust nniḍen, ikad seg Viper akked Boogie, i tt-yesɛan s tidet." },
        "Afares s tidet: imi Creusot ur yesɛi ara separation logic-is, yal amgirred i s-yesra separation logic — am «izekwan n uneggaru-a ur mlalen ara akked wid n wayeḍ» — ilaq ad d-yekcem s ubrid nniḍen. Creusot ixeddem-it s wallal ɣef tira n ayla akked usuter n Rust, s ghost code, d ayen i d-yefkan PtrOwn.",
        "Iwakken ad twaliḍ ayɣer wagi yesra, ẓer asemseɣti n tebdart yebḍan iẓekwan akked tayeḍ — am α = [1,2,3] akked β = [4,5,3], bḍan aẓekka 3. Alugan sḥel yezmer ad d-yeqqaṛ: seg list p α, sekcem list p ᾱ, tuɣzi tettwaseɣti. Wagi ibân-d d ameɣtu, maca weḥd-s ur d-yeqqaṛ acemma ɣef wayen i d-yeḍran i β, i d-yeṭṭfen ɣer negg-is n wayen yellan yakan yettwaseɣti.",
        { img: "images/creusot-shared-lists.png", alt: "Asemseɣti n α mi tebḍa taggara-ines akked β: amgirred sḥel list p α / list p ᾱ ur d-yeqqaṛ acemma ɣef wayen i d-yeḍran i yiẓekwan 2 akked 3 yebḍan, ne ɣef β, i d-yeṭṭfen mazal-it ɣer negg-is n wayen yellan yakan yettwaseɣti." },
        "Akud n Rust n tidet ur izmir ara ad yerr β d amixṛeb s wudem-a — anagraw n twinasin isnad yakan belli ulac snat n izekwan yeddren i temɣaren s wudem yerran wagi ur d-yeqqar ara unsafe. Maca alugan asuf yettwarun seg tazwara ur yessin ara ayen-nni s wudem awurman; ilaq ad as-t-id-nini, d ayen i d-yesnulfa separation logic: asenqad n telqay n tkatut ur nemṣada ara, iwakken abeddel deg yiwet n telqay yeǧǧa tayeḍ ur nettwarnu ara. Creusot ulac deg-s separation logic, dɣa akatar isekyed aqadeṛ-a s ufus, s tikci n ayla.",
        { code: "pub struct Node<T> {\n    elem: T,\n    pub next: RawPtr<Node<T>>,\n}\n\n#[predicate]\n#[variant(perm_seq.len())]\nfn list(l: RawPtr<Self>, perm_seq: Seq<PtrOwn<Node<T>>>) -> bool {\n    pearlite! {\n        if l.is_null_logic() {\n            perm_seq.len() == 0\n        } else if perm_seq.len() > 0 {\n            let ptr = perm_seq[0].ptr();\n            l == ptr && Self::list(perm_seq[0].val().next, perm_seq.tail())\n        } else {\n            false\n        }\n    }\n}", caption: "Alugan (predicate) list: pointer l, akked tuɣzi ghost n yiẓekwan yellan d ayla-s perm_seq, sbeggnen tabdart tumḍint." },
        "list d alugan agejdan i telemmist meṛṛa. Pointer weḥd-s ur d-yettawi ara aqadeṛ belli yeṭṭef ɣer Node yelhan — Creusot ur yezmir ara ad iẓer ayen yellan deg pointer araw am wamek yezmer i twuri &T. Tuɣzi n PtrOwn i d-yefkan aqadeṛ-a: yal PtrOwn d ashadu ghost yeqqaṛen belli win i s-yesɛan yeṭṭef weḥd-s aẓekka deg tkatut, list yesenqad s telemmist ma yemṣada pointer, aqerru n tuɣzi, akked warrac-is.",
        { img: "images/creusot-ptrown-structure.png", alt: "Talɣa agensay n PtrOwn<T>: deg umaḍal ghost, yesdukel taɣawsa ptr (d RawPtr<T>) akked val (azal n tidet n uẓekka). Aṭas n RawPtr<T> deg umaḍal n twuri zemren ad mṣadan akked ptr-a, maca PtrOwn kan i d-yesbegganen belli aya d ayla-s weḥd-s — RawPtr weḥd-s d tansa kan, war aqadeṛ-a." },
        "D wagi i d amdiq i s-yestehzi list: RawPtr<T> d amḍan kan i d-yeqqaṛen ɣef tansa, dɣa alugan n Creusot ur izmir ara ad yefṛeq gar pointer yexlan neɣ yemṣadan akked win yelhan s wallul kan. Aṭṭafeṭ n PtrOwn d ashadu deg umaḍal ghost yeqqaṛen belli aẓekka-nni s tidet yeddren yerna d ayla-s kan — d aqadeṛ i yesran iwakken ad d-yeddu s laman seg uẓekka ɣer wayeḍ.",
        { img: "images/creusot-list-memory.png", alt: "Tabdart n 4 iẓekwan p → v1 → v2 → v3 → v4 → nil akken i tt-yesenqad list s tidet: yal RawPtr n umaḍal n twuri deg tsequwt (afella) yemṣada iwet ɣef iwet akked wemḍiq PtrOwn deg tuɣzi ghost perm_seq (adda), akked ptr n yal PtrOwn yettuɣal ɣer uẓekka-nni s timmad-is." },
        "list(l, perm_seq) yella d tidet mi tugna-a tṣeḥḥa: leqḍ n tsequwt n pointers n tidet akked leqḍ n tuɣzi ghost s wudem yemṣadan ttawḍen ɣer yiwen n uẓekka i yal amḍiq, alamma bḍan snat-nsent deg tikkelt yiwet — pointer d ilem akked tuɣzi d tilemt. Amṣada-a d ayen i s-yesra requires akked ensures n reverse_in_place, tikkelt uqbel tazwara n twuri, tikkelt nniḍen ɣer taggara-ines.",
        { code: "#[requires(Self::list(p, **seq))]\n#[ensures(Self::list(result, *^seq))]\n#[ensures(seq.len() == (^seq).len())]\n#[ensures(Self::inverse(**seq, *^seq, 0, (*^seq).len()))]\npub fn reverse_in_place(\n    mut p: RawPtr<Self>,\n    seq: &mut Ghost<Seq<PtrOwn<Node<T>>>>,\n) -> RawPtr<Self>", caption: "Amgirred (contract) n reverse_in_place." },
        "Requires teqqaṛ kan: p, akked tuɣzi ghost seq, d tabdart tumḍint — yemṣada akked tugna sennig. Ensures d tamawt n tseḥḥa tidet: pointer i d-yettuɣalen d tabdart tumḍint daɣen; tuɣzi tesɛa iwet uɣzis uqbel d awer; akked, d ayen i d-yeqqaṛen “asemseɣti” s tidet, inverse gar tuɣzi taqbuṛt d tamaynut: aferdis i deg tuɣzi tamaynut (seg tagara-ines) d aferdis i deg tuɣzi taqbuṛt (seg tazwara-ines), i yal amḍiq.",
        { code: "#[invariant(Self::list(q, *reverted_seq))]\n#[invariant(Self::list(p, **seq))]\n#[invariant(Self::inverse(\n    _seq0.subsequence(0, reverted_seq.len()),\n    *reverted_seq, 0, reverted_seq.len()\n))]\n#[invariant(reverted_seq.len() + seq.len() == _seq0.len())]\n#[invariant(**seq == _seq0.subsequence(reverted_seq.len(), _seq0.len()))]\nwhile !p.is_null() { ... }", caption: "Invariants n tallelt, i d-ittawin telemmist s uẓekka s uẓekka." },
        { img: "images/creusot-invariant-memory.png", alt: "Tkatut deg negg n tallelt, temṣada akked q/reverted_seq d p/seq deg tengalt: tama yettwaxdmen (ɣer uzelmaḍ) tesɛa v1 i d-yeṭṭfen ɣer nil akked v2 i d-yeṭṭfen ɣer deffir ɣer v1 — snat iẓekwan i yemsebḍan armi tura; tama ur nettwaxdem ara (ɣer uyeffus) tesɛa mazal v3 i d-yeṭṭfen ɣer v4 i d-yeṭṭfen ɣer nil, akken yellan deg tebdart taqburt." },
        "Yal tikkelt n tallelt, aẓekka yiwen yezzi seg pointer p (ur nettwaxdem ara) ɣer pointer q (yettwaxdem yakan), issenta-d telqeḍt i d-tesbeggen tugna. Xemsa invariants ṭṭfen akk telemmist d tidet: tama yettwaxdmen (q, reverted_seq) d tabdart tumḍint; tama ur nettwaxdem ara (p, seq) daɣen; reverted_seq d asemseɣti n telqeḍt yemṣadan seg tebdart taqburt; ulac aẓekka ittwarnan neɣ ittwaqḍaɛen, imi tuɣzi n snat n tmiwa dima tettarra ɣer tuɣzi taqburt; tama ur nettwaxdem ara dima d telqeḍt yemṣadan n tuɣzi taqburt. seq tettnuqes s yiwen uẓekka i yal tallelt, tallelt tḥebbes mi p yuɣal d ilem, dɣa akatar itemm — syen, reverted_seq d asemseɣti n tebdart meṛṛa, akken i d-teqqaṛ ensures.",
        "reverse_in_place d amaslaḍ (module) yellan deg lib.rs, ittwabeṭṭ akmal. Wayeḍ deg umḍiq — amsaɣ n Morris i uẓar, heapsort, insertion sort, anadi asuf, d wiyaḍ — d irmuden n telemmist yettwajjan d awennit, ttwaxedmen maca mačči akk armi d taggara n usekyed."
      ]
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/rust_code_formal_verification" }
    ],
    images: []
  },
  {
    slug: "why3-verification",
    type: "research",
    title: {
      en: "Program Verification with Why3",
      fr: "Vérification de programmes avec Why3",
      kab: "Aselqed n Isefka s Why3"
    },
    period: { en: "Jan - May 2025", fr: "Janv. - Mai 2025", kab: "Yennayer - Mayyu 2025" },
    lab: {
      en: "Laboratory of Formal Methods, Gif-sur-Yvette",
      fr: "Laboratoire Méthodes Formelles, Gif-sur-Yvette",
      kab: "Laboratoire Méthodes Formelles, Gif-sur-Yvette"
    },
    supervisors: "Jean-Christophe Filliatre",
    summary: {
      en: "Formal program verification of a depth-first search algorithm using the Why3 language.",
      fr: "Vérification formelle d'un algorithme de parcours en profondeur à l'aide du langage Why3.",
      kab: "Aselqed unṣib n ualgoritm n unadi s telqey (DFS) s tutlayt Why3."
    },
    description: {
      en: "Supervised by Jean-Christophe Filliatre, formal program verification using the Why3 language.",
      fr: "Encadré par Jean-Christophe Filliatre, vérification formelle de programmes à l'aide du langage Why3.",
      kab: "Ittwasenced sɣur Jean-Christophe Filliatre, aselqed unṣib n isefka s tutlayt Why3."
    },
    details: {
      en: [
        "The core of the project is dfs: a depth-first search that computes every vertex reachable from a given start vertex v', implemented as two mutually recursive functions, branch (visit one vertex) and loop (walk its list of neighbours), and proved correct against a reachability predicate rather than just tested.",
        { code: "type path = list int\n\npredicate path (g: Graph.t) (x y: int) (p: path)\n= 1 <= length p /\\ x = nth 0 p /\\ y = nth (length p - 1) p /\\\n  (forall i. 0 <= i < length p -> 0 <= nth i p < Graph.size g) /\\\n  (forall i. 0 <= i < length p - 1 ->\n     mem (nth (i+1) p) (Graph.succ g (nth i p)))", caption: "The path predicate: p is a genuine walk in g from x to y." },
        "path is the witness the whole proof turns on: p is a list of vertices that starts at x, ends at y, stays inside the graph, and where each consecutive pair is really joined by an edge. Rather than asserting reachability abstractly (‘there exists some path’), the code carries an explicit ghost path argument through the recursion — the author's own comments explain this was chosen over an existential quantifier because it gives Why3 a concrete object to extend one edge at a time, which is far easier to discharge automatically than reasoning about an existentially-quantified witness.",
        { code: "let rec branch v (ghost pt: path)\n  requires{ 0 <= v < Graph.size g }\n  requires{ forall i. visited[i] -> mem i (!accessible) }\n  requires{ forall i. visited[i] ->\n              exists p: path. path g v' i p }\n  requires{ path g v' v pt }\n  ensures { visited[v] }\n  ensures { mem v (!accessible) }\n  ensures { forall i. visited[i] ->\n              exists p: path. path g v' i p }\n  variant { nv visited, 0 }\n= ...", caption: "branch's contract (abbreviated): visiting v keeps every invariant of the search intact." },
        "The requires clauses set up the loop invariant that branch and loop maintain jointly across the whole traversal: visited and accessible always agree, and every vertex marked visited is backed by an actual path predicate proof that v' can reach it — that is the soundness half of the algorithm, proved by induction as the search extends pt one edge at a time. Termination is handled by the variant nv visited, 0, where nv counts the not-yet-visited vertices in the array: since branch only recurses into unvisited neighbours (immediately marking them visited first), that count strictly decreases with every recursive call, so the mutual recursion between branch and loop cannot loop forever.",
        "One honest limitation is documented directly in the source: a fully proved ensures for completeness — that every vertex reachable from v' does end up in accessible — is written but left commented out. The author's comment explains why it resisted an easy proof: a vertex first reached only through a node that is already visited is never re-explored from that node, so the completeness argument needs a more delicate induction than the soundness direction did. The code is honest about the gap rather than claiming a stronger guarantee than what was actually discharged."
      ],
      fr: [
        "Le cœur du projet est dfs : un parcours en profondeur qui calcule tous les sommets accessibles depuis un sommet de départ v', implémenté par deux fonctions mutuellement récursives, branch (visiter un sommet) et loop (parcourir sa liste de voisins), et prouvé correct par rapport à un prédicat d'accessibilité plutôt que simplement testé.",
        { code: "type path = list int\n\npredicate path (g: Graph.t) (x y: int) (p: path)\n= 1 <= length p /\\ x = nth 0 p /\\ y = nth (length p - 1) p /\\\n  (forall i. 0 <= i < length p -> 0 <= nth i p < Graph.size g) /\\\n  (forall i. 0 <= i < length p - 1 ->\n     mem (nth (i+1) p) (Graph.succ g (nth i p)))", caption: "Le prédicat path : p est bien un chemin réel dans g de x vers y." },
        "path est le témoin sur lequel repose toute la preuve : p est une liste de sommets qui commence en x, finit en y, reste dans le graphe, et où chaque paire consécutive est effectivement reliée par une arête. Plutôt que d'affirmer l'accessibilité de façon abstraite (« il existe un chemin »), le code fait porter un argument fantôme explicite pt à travers la récursion — les commentaires de l'auteur expliquent que ce choix, plutôt qu'un quantificateur existentiel, donne à Why3 un objet concret à étendre arête par arête, bien plus facile à prouver automatiquement qu'un raisonnement sur un témoin existentiel.",
        { code: "let rec branch v (ghost pt: path)\n  requires{ 0 <= v < Graph.size g }\n  requires{ forall i. visited[i] -> mem i (!accessible) }\n  requires{ forall i. visited[i] ->\n              exists p: path. path g v' i p }\n  requires{ path g v' v pt }\n  ensures { visited[v] }\n  ensures { mem v (!accessible) }\n  ensures { forall i. visited[i] ->\n              exists p: path. path g v' i p }\n  variant { nv visited, 0 }\n= ...", caption: "Le contrat de branch (abrégé) : visiter v préserve tous les invariants du parcours." },
        "Les clauses requires posent l'invariant de boucle que branch et loop maintiennent conjointement pendant tout le parcours : visited et accessible restent toujours en accord, et chaque sommet marqué visited est soutenu par une preuve réelle du prédicat path montrant que v' peut l'atteindre — c'est la moitié « correction » (soundness) de l'algorithme, prouvée par induction à mesure que la recherche étend pt arête par arête. La terminaison est assurée par le variant nv visited, 0, où nv compte les sommets pas encore visités dans le tableau : comme branch ne récurse que sur des voisins non visités (en les marquant visited immédiatement), ce compte diminue strictement à chaque appel récursif, donc la récursion mutuelle entre branch et loop ne peut pas boucler indéfiniment.",
        "Une limite honnêtement documentée directement dans le code source : un ensures entièrement prouvé pour la complétude — le fait que tout sommet accessible depuis v' finit bien dans accessible — est écrit mais laissé en commentaire. Le commentaire de l'auteur explique pourquoi cela a résisté à une preuve simple : un sommet atteint pour la première fois seulement via un nœud déjà visité n'est jamais réexploré depuis ce nœud, donc l'argument de complétude demande une induction plus délicate que celle de la correction. Le code assume honnêtement cette lacune plutôt que de prétendre à une garantie plus forte que ce qui a réellement été prouvé."
      ],
      kab: [
        "Alqem agejdan n uselkim d dfs: anadi s telqey (depth-first search) i d-yeḥsaben akk iɣerman i sen-tezmer ad tawḍ tazwara v', yettwaselkam s snat twuriwin i yemyerran (branch i uziyar n yiwen uɣerman, loop i uzray n tebdart n imezdaɣ-is), yettwabeṭṭ s tidet ɣer alugan n uɣerman mačči kan s ubeddel (test).",
        { code: "type path = list int\n\npredicate path (g: Graph.t) (x y: int) (p: path)\n= 1 <= length p /\\ x = nth 0 p /\\ y = nth (length p - 1) p /\\\n  (forall i. 0 <= i < length p -> 0 <= nth i p < Graph.size g) /\\\n  (forall i. 0 <= i < length p - 1 ->\n     mem (nth (i+1) p) (Graph.succ g (nth i p)))", caption: "Alugan path: p d abrid n tidet deg g seg x ɣer y." },
        "path d ashadu i telemmist meṛṛa: p d tabdart n yiɣerman yebdan s x, yeggran s y, yeqqimen deg ugraf, dɣa yal snat n imezdaɣ yezrin qqnen s wallal. Deg umḍiq n aqadeṛ ɣef uɣerman s wudem asuf (“yella webrid”), akud yettawi ghost abrid pt s tidet deg telemmist — iwenniten n bab n usekyed sbeggnen belli asefran-a, deg umḍiq n quantifier n “yella”, ifka i Why3 ayen ittwabnan s wallal s wallal, ishel aṭas i ubeṭṭ s wudem awurman.",
        { code: "let rec branch v (ghost pt: path)\n  requires{ 0 <= v < Graph.size g }\n  requires{ forall i. visited[i] -> mem i (!accessible) }\n  requires{ forall i. visited[i] ->\n              exists p: path. path g v' i p }\n  requires{ path g v' v pt }\n  ensures { visited[v] }\n  ensures { mem v (!accessible) }\n  ensures { forall i. visited[i] ->\n              exists p: path. path g v' i p }\n  variant { nv visited, 0 }\n= ...", caption: "Amgirred n branch (yettwaqṣeṛ): aziyar n v yettḥarez akk invariants n unadi." },
        "Requires sbedden invariant n tallelt i branch akked loop ṭṭfen s tugniwin deg akatar n unadi meṛṛa: visited akked accessible dima mṣadan, yal aɣerman yettwacerḍen visited yesɛa ashadu n path yesbeggnen belli v' izmer ad t-yaweḍ — wagi d tama n tseḥḥa n ualgoritm, ittwabeṭṭ s telqayt (induction) mi unadi issenta pt s wallal s wallal. Akatar itemm s uvariant nv visited, 0, anda nv yeḥsab iɣerman ur nettwazwar ara: imi branch yezwar kan ɣer imezdaɣ ur nettwazwar ara (yeqqen-iten visited imir kan), amḍan-a yettnaqes s tidet deg yal aẓray, dɣa telemmist ur tezmir ara ad tqim tettales i lebda.",
        "Talast yettwabegnen s tidet deg uɣbalu: ensures ibeṭṭen akmal i tummant (completeness) — belli yal aɣerman i s-tezmer v' ad t-yaweḍ ad d-yeffeɣ deg accessible — yura maca yeqqim d awennit. Awennit n bab n usekyed isebgen amek i as-yewɛeṛ ubeṭṭ: aɣerman i d-yettwafen tikkelt tamezwarut kan seg uɣerman yellan yakan d visited ur d-yettuɣal ara ad ittwasnad seg-s, dɣa afaris n tummant yesra telqayt yewɛeṛen ugar n win n tseḥḥa. Akud yeqqaṛ tidet ɣef wemgired-a deg umḍiq n aḍmin n uɛeggu ugar n wayen yellan s tidet yettwabeṭṭen."
      ]
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/depth_fst_search_verification_why3" }
    ],
    images: []
  },
  {
    slug: "diffusion-model",
    type: "project",
    title: {
      en: "Denoising Diffusion Probabilistic Model",
      fr: "Modèle probabiliste de diffusion débruitante (DDPM)",
      kab: "Amudel Asemmid Yekksen Ameǧlaḍ (DDPM)"
    },
    period: { en: "Apr - May 2026", fr: "Avr. - Mai 2026", kab: "Yebrir - Mayyu 2026" },
    summary: {
      en: "Implementation of DDPM (Ho, Jain and Abbeel, 2020) using PyTorch.",
      fr: "Implémentation du DDPM (Ho, Jain et Abbeel, 2020) avec PyTorch.",
      kab: "Ahegga n DDPM (Ho, Jain d Abbeel, 2020) s PyTorch."
    },
    description: {
      en: "Implemented the model described in Ho, Jain and Abbeel, \"Denoising Diffusion Probabilistic Models\", arXiv:2006.11239, 2020, using the PyTorch library.",
      fr: "Implémentation du modèle décrit dans Ho, Jain et Abbeel, « Denoising Diffusion Probabilistic Models », arXiv:2006.11239, 2020, à l'aide de la bibliothèque PyTorch.",
      kab: "Heggaɣ amudel yettwabeggnen deg twaraqt n Ho, Jain d Abbeel, « Denoising Diffusion Probabilistic Models », arXiv:2006.11239, 2020, s tebbura n PyTorch."
    },
    links: [
      { label: "GitHub", url: "https://github.com/amineouat/Deep-L" },
      { label: "Paper", url: "https://arxiv.org/abs/2006.11239" }
    ],
    images: []
  },
  {
    slug: "k-server",
    type: "project",
    title: {
      en: "Polylogarithmic Algorithm for the k-Server Problem",
      fr: "Algorithme polylogarithmique pour le problème des k-serveurs",
      kab: "Algoritm Polylogaritmi i Wugur n k-iqeddacen"
    },
    period: { en: "Jan - Feb 2026", fr: "Janv. - Févr. 2026", kab: "Yennayer - Fuṛar 2026" },
    summary: {
      en: "Approximation of a polylogarithmic-competitive online algorithm for the k-server problem.",
      fr: "Approximation d'un algorithme en ligne polylogarithmique-compétitif pour le problème des k-serveurs.",
      kab: "Aqerreb n walgoritm srid (online) polylogaritmi i wugur n k-iqeddacen."
    },
    description: {
      en: "Implemented an approximation of the algorithm described in Bansal, Buchbinder, Madry and Naor, \"A Polylogarithmic-Competitive Algorithm for the k-Server Problem\", arXiv:1110.1580, 2011, resolving the k-server problem in O(log^3 n log^2 k log log n) for any metric space on n points.",
      fr: "Implémentation d'une approximation de l'algorithme décrit dans Bansal, Buchbinder, Madry et Naor, « A Polylogarithmic-Competitive Algorithm for the k-Server Problem », arXiv:1110.1580, 2011, résolvant le problème des k-serveurs en O(log^3 n log^2 k log log n) pour tout espace métrique à n points.",
      kab: "Heggaɣ aqerreb n walgoritm yettwabeggnen deg twaraqt n Bansal, Buchbinder, Madry d Naor, « A Polylogarithmic-Competitive Algorithm for the k-Server Problem », arXiv:1110.1580, 2011, yefrayen ugur n k-iqeddacen deg O(log^3 n log^2 k log log n) i yal amḍiq ameṭri s n tenqiḍin."
    },
    links: [
      { label: "GitHub", url: "https://github.com/sha0811/project_randomized_algorithms" },
      { label: "Paper", url: "https://arxiv.org/abs/1110.1580" }
    ],
    images: []
  },
  {
    slug: "retrieval-challenge",
    type: "project",
    title: {
      en: "Scientific Article Retrieval Challenge",
      fr: "Défi de recherche d'articles scientifiques",
      kab: "Asenfar n Unadi ɣef Yirtal Ussnanen"
    },
    period: { en: "2025 - 2026", fr: "2025 - 2026", kab: "2025 - 2026" },
    summary: {
      en: "Ranked 2nd on a document-ranking task, combining dense and sparse retrieval, NDCG@10 = 0.76.",
      fr: "2e place sur une tâche de classement de documents, combinant recherche dense et parcimonieuse, NDCG@10 = 0,76.",
      kab: "Amḍiq wis-sin deg umahil n usmizzel n yirtal, s tuddma n dense akked sparse retrieval, NDCG@10 = 0.76."
    },
    description: {
      en: "Ranked 2nd on a document-ranking task retrieving relevant papers from a 20,000-document corpus, combining dense retrieval (BGE-large, GTE-large, Granite R2) via Reciprocal Rank Fusion with BM25/TF-IDF sparse retrieval and a domain-relevance bonus, reaching NDCG@10 = 0.76.",
      fr: "Classé 2e sur une tâche de classement de documents consistant à retrouver les articles pertinents dans un corpus de 20 000 documents, combinant recherche dense (BGE-large, GTE-large, Granite R2) via Reciprocal Rank Fusion avec une recherche parcimonieuse BM25/TF-IDF et un bonus de pertinence thématique, atteignant NDCG@10 = 0,76.",
      kab: "Amḍiq wis-sin deg umahil n usmizzel n yirtal, unadi ɣef yiwaraqen yeqḍen deg 20.000 n yirtal, s tuddma n dense retrieval (BGE-large, GTE-large, Granite R2) s Reciprocal Rank Fusion akked sparse retrieval BM25/TF-IDF, akked lḥerz n telɣa n taɣult, awḍeɣ ɣer NDCG@10 = 0.76."
    },
    links: [
      { label: "GitHub", url: "https://github.com/amineouat/Information-Retrieval" },
      { label: "Codabench", url: "https://www.codabench.org/competitions/15308/" }
    ],
    images: []
  },
  {
    slug: "nas-automl-challenge",
    type: "project",
    title: {
      en: "Neural Architecture Search AutoML Challenge",
      fr: "Défi AutoML de recherche d'architecture neuronale",
      kab: "Asenfar AutoML n Unadi ɣef Tbenyi n Iẓran"
    },
    period: { en: "Jul - Sep 2026", fr: "Juil. - Sept. 2026", kab: "Yulyu - Ctember 2026" },
    summary: {
      en: "Reproduced and benchmarked a single-run network-growth architecture search method (Gromo) across five datasets.",
      fr: "Reproduction et évaluation d'une méthode de recherche d'architecture par croissance de réseau (Gromo) sur cinq jeux de données.",
      kab: "Ales n uxeddim akked usmizzel n tarrayt n tbenyi n uẓar (Gromo) ɣef xemsa n yisefka."
    },
    description: {
      en: "Reproduced and benchmarked the \"Demeter\" single-run network-growth architecture search method from an anonymous NeurIPS 2026 submission (\"Should I train or should I grow?\"), built on the Gromo package, across five benchmark datasets (MultNIST, CifarTile, Gutenberg, Chesseract, GeoClassing), closely matching the paper's reported accuracy and documenting inconsistencies in the paper and bugs in the accompanying code.",
      fr: "Reproduction et évaluation de la méthode de recherche d'architecture par croissance de réseau en une seule exécution « Demeter », issue d'une soumission anonyme à NeurIPS 2026 (« Should I train or should I grow? »), construite sur le package Gromo, sur cinq jeux de données de référence (MultNIST, CifarTile, Gutenberg, Chesseract, GeoClassing), avec une précision proche de celle rapportée dans l'article et la documentation d'incohérences dans l'article ainsi que de bugs dans le code associé.",
      kab: "Ales n uxeddim akked usmizzel n tarrayt \"Demeter\" (anadi ɣef tbenyi n uẓar s tikkelt yiwet), i d-yekkan seg twaraqt tuffirt i NeurIPS 2026 (\"Should I train or should I grow?\"), yebnan ɣef upaket Gromo, ɣef xemsa n yisefka n uqiyas (MultNIST, CifarTile, Gutenberg, Chesseract, GeoClassing), s tɣara tuqrib i tin i d-yenna twaraqt, akked usekles n yir-tira deg twaraqt akked yir-tira deg tengalt."
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/nas_automl_challenge" }
    ],
    images: []
  },
  {
    slug: "mini-rust",
    type: "project",
    title: {
      en: "Mini-Rust Compiler",
      fr: "Compilateur Mini-Rust",
      kab: "Amsuddes Mini-Rust"
    },
    period: { en: "Apr - Jun 2025", fr: "Avr. - Juin 2025", kab: "Yebrir - Yunyu 2025" },
    summary: {
      en: "A mini-compiler for a subset of Rust with lifetime constraint generation and borrow checking.",
      fr: "Un mini-compilateur pour un sous-ensemble de Rust avec génération de contraintes de durée de vie et vérification d'emprunts.",
      kab: "Amsuddes amecṭuḥ i kra n Rust, s tarusi n lqecc n tuddert (lifetime) akked usenqed n usuter (borrow checking)."
    },
    description: {
      en: "Implemented a mini-compiler for a subset of Rust including lifetime constraint generation, borrow checking and memory access verification.",
      fr: "Implémentation d'un mini-compilateur pour un sous-ensemble de Rust incluant la génération de contraintes de durée de vie, la vérification d'emprunts et la vérification d'accès mémoire.",
      kab: "Heggaɣ amsuddes amecṭuḥ i kra n Rust, s tarusi n lqecc n tuddert, usenqed n usuter (borrow checking) akked uselqed n unekcum ɣer twennaḍt (memory)."
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/Mini-rust" }
    ],
    images: []
  },
  {
    slug: "geo-simulation",
    type: "project",
    title: {
      en: "Geographical Simulation",
      fr: "Simulation géographique",
      kab: "Aselkin Tamurt (Simulation Tageografit)"
    },
    period: { en: "Apr - May 2024", fr: "Avr. - Mai 2024", kab: "Yebrir - Mayyu 2024" },
    summary: {
      en: "Simulation of Saint-Aubin geography using real physical laws and optimization methods.",
      fr: "Simulation de la géographie de Saint-Aubin à l'aide de lois physiques réelles et de méthodes d'optimisation.",
      kab: "Aselkin n tmurt n Saint-Aubin s wulawen n tfizikt tidet akked tarrayin n uswizzel."
    },
    description: {
      en: "Simulation of Saint-Aubin geography using real physical laws on objects, combined with optimization methods.",
      fr: "Simulation de la géographie de Saint-Aubin appliquant des lois physiques réelles aux objets, combinée à des méthodes d'optimisation.",
      kab: "Aselkin n tmurt n Saint-Aubin, s usnas n wulawen n tfizikt tidet ɣef yifergan, myuddam akked tarrayin n uswizzel."
    },
    details: {
      en: [
        "This project — done with Ramy Sail, supervised by Capucine Nighem, second year of the Bachelor's degree — renders a real place: the Saint-Aubin valley near the university, as a textured 3D terrain carrying 25 electrical pylons, the power lines strung between them, and wind turbines on the surrounding hills. The write-up below follows the report we submitted, walking through the four pieces that made it work: the terrain shader, the pylon geometry, the altitude interpolation that lets anything sit correctly on uneven ground, and the catenary-physics derivation that gives the power lines their real hanging shape rather than a straight line.",
        { img: "images/geo-hero-scene.jpg", alt: "The finished scene: pylons following the ridge line, power lines strung between them, and two wind turbines on the hillside behind, all sitting on the real Saint-Aubin terrain." },
        "The terrain itself comes from real elevation data, loaded as a mesh whose z ranges from -202.1 to -179.6 — about 22 units of relief. A fragment shader draws a contour line every 1.1 units of z (about 20 lines across that range) and colors everything below -198 green, marking out the valley floor where the village sits.",
        { img: "images/geo-terrain-contours.jpg", alt: "The terrain with its shader-drawn contour lines, one every 1.1 units of elevation." },
        "Each pylon is modeled after a real one: we measured a reference photograph in Adobe Illustrator to get a handful of key lengths — the base width, the head height, the arm span — and derived the rest with Pythagoras' and Thales' theorems rather than measuring everything by hand. Eleven attachment points per pylon, each a PVector, are where the power-line cables actually connect.",
        { img: "images/geo-pylon-geometry.png", alt: "The pylon's labeled attachment points (Liaison1-13, skipping the symmetric pairs), derived from a handful of measured lengths via Pythagoras and Thales." },
        "Placing anything on the terrain — a pylon, a turbine, a line endpoint — needs its altitude at an arbitrary (x, y), and the terrain is a mesh of 9,999 triangles. Rather than searching all of them every time, a point-in-triangle test (comparing the normals of the three sub-triangles PBC, PCA, PAB via dot products) finds the enclosing triangle, and the altitude is just the average z of its three corners — a simple barycentric-style interpolation.",
        "The power lines were the hardest part: a cable strung between two pylons of possibly different heights sags into a curve, and getting that curve right means solving an actual physics problem, not faking a sag with a spline. Cutting the cable into infinitesimal segments and writing Newton's second law on one segment (tension pulling from both ends, gravity pulling down, zero acceleration since the cable is in equilibrium) gives a differential equation for the cable's shape:\n$$y''(x) = g\\,\\frac{M}{LC}\\,\\sqrt{1 + y'(x)^2}$$\nwhere $M$ is the cable's mass, $L$ its length, and $C$ the (unknown, constant) horizontal component of tension.",
        { img: "images/geo-catenary-forces.png", alt: "Free-body diagram for the catenary derivation: an infinitesimal cable segment with tension pulling from both ends and gravity pulling down, plus the force triangles used to project onto the x and y axes." },
        "Solving that equation (a standard trick: substitute $y'(x)=u(x)$, separate variables, and recognize the resulting integral as $\\sinh$) gives the catenary curve:\n$$y(x) = \\frac{1}{g\\frac{M}{LC}} \\cosh\\!\\left(g\\,\\frac{M}{LC}\\,x + A\\right) + B$$\nThree unknowns come out of the integration — $A$, $B$, $C$ — pinned down by three facts we actually know: the cable passes through both pylon attachment points, and its total length is $L$. $A$ falls out directly as an $\\mathrm{atanh}$ of the height difference over $L$; $B$ and $C$ are coupled in a transcendental equation, so they're solved numerically with Newton-Raphson rather than in closed form.",
        "With the curve solved, the 25 pylons are placed along the line $y = -10.75x + 315$ between two fixed endpoints, evenly spaced in $x$; getZ(x, y) supplies each one's altitude so it sits flush with the terrain, rotated to match the line's slope. Which attachment point on one pylon connects to which point on the next is looked up in a hash map (e.g. point 4 to point 5, point 2 to point 3), so the cables attach at the right height and side rather than just pylon-center to pylon-center.",
        { img: "images/geo-turbine-construction.png", alt: "The wind turbine built from Bézier curves in three independent pieces — holder, head, and blade — then assembled into the finished shape." },
        "The wind turbines follow the same construction principle as the pylons but with Bézier curves instead of straight measured segments: a holder (the tower), a head (the nacelle), and a blade, each modeled separately and then combined. They're placed on the hilltops on the far side of the pylons from the valley, so their generated power feeds into the same line that carries it down to the village.",
        "Working through it end to end meant applying things that had so far stayed theoretical — Euler's method and hyperbolic functions turning into the actual shape of a hanging cable — and picking up Adobe Illustrator along the way as a genuinely useful tool for a computer scientist, not just a designer's program."
      ],
      fr: [
        "Ce projet — réalisé avec Ramy Sail, encadré par Capucine Nighem, en deuxième année de licence — met en scène un lieu réel : la vallée de Saint-Aubin près de l'université, sous la forme d'un terrain 3D texturé portant 25 pylônes électriques, les lignes tendues entre eux, et des éoliennes sur les collines environnantes. Le texte ci-dessous suit le rapport que nous avons remis, en parcourant les quatre éléments qui ont permis de le faire fonctionner : le shader du terrain, la géométrie des pylônes, l'interpolation d'altitude qui permet à tout objet de reposer correctement sur un sol irrégulier, et la dérivation physique de la chaînette qui donne aux lignes électriques leur véritable forme, au lieu d'une ligne droite.",
        { img: "images/geo-hero-scene.jpg", alt: "La scène terminée : les pylônes suivent la ligne de crête, les lignes électriques sont tendues entre eux, et deux éoliennes se dressent sur la colline en arrière-plan, le tout posé sur le vrai terrain de Saint-Aubin." },
        "Le terrain lui-même provient de données d'altitude réelles, chargé comme un maillage dont le z va de -202,1 à -179,6, soit environ 22 unités de relief. Un fragment shader trace une ligne de niveau tous les 1,1 unité de z (environ 20 lignes sur cette plage) et colore en vert tout ce qui est en dessous de -198, marquant le fond de la vallée où se trouve le village.",
        { img: "images/geo-terrain-contours.jpg", alt: "Le terrain avec ses lignes de niveau tracées par le shader, une tous les 1,1 unité d'altitude." },
        "Chaque pylône est modélisé d'après un pylône réel : nous avons mesuré une photo de référence dans Adobe Illustrator pour obtenir quelques longueurs clés — largeur de base, hauteur de tête, envergure des bras — et déduit le reste avec les théorèmes de Pythagore et de Thalès plutôt que de tout mesurer à la main. Onze points d'attache par pylône, chacun un PVector, sont les endroits où les câbles se connectent réellement.",
        { img: "images/geo-pylon-geometry.png", alt: "Les points d'attache étiquetés du pylône (Liaison1-13, en omettant les paires symétriques), déduits de quelques longueurs mesurées via Pythagore et Thalès." },
        "Placer quoi que ce soit sur le terrain — un pylône, une éolienne, l'extrémité d'une ligne — nécessite son altitude en un (x, y) quelconque, et le terrain est un maillage de 9 999 triangles. Plutôt que de tous les parcourir à chaque fois, un test point-dans-triangle (comparant par produit scalaire les normales des trois sous-triangles PBC, PCA, PAB) trouve le triangle englobant, et l'altitude est simplement la moyenne des z de ses trois sommets — une interpolation simple de type barycentrique.",
        "Les lignes électriques ont été la partie la plus difficile : un câble tendu entre deux pylônes de hauteurs éventuellement différentes s'affaisse en une courbe, et obtenir la bonne courbe suppose de résoudre un vrai problème de physique, pas de simuler un affaissement avec une spline. En découpant le câble en segments infinitésimaux et en écrivant la deuxième loi de Newton sur un segment (tension tirant des deux côtés, gravité tirant vers le bas, accélération nulle puisque le câble est à l'équilibre), on obtient une équation différentielle pour la forme du câble :\n$$y''(x) = g\\,\\frac{M}{LC}\\,\\sqrt{1 + y'(x)^2}$$\noù $M$ est la masse du câble, $L$ sa longueur, et $C$ la composante horizontale (inconnue, constante) de la tension.",
        { img: "images/geo-catenary-forces.png", alt: "Diagramme du corps libre pour la dérivation de la chaînette : un segment infinitésimal de câble avec la tension tirant des deux côtés et la gravité tirant vers le bas, plus les triangles de forces utilisés pour projeter sur les axes x et y." },
        "Résoudre cette équation (une astuce classique : poser $y'(x)=u(x)$, séparer les variables, et reconnaître l'intégrale obtenue comme un $\\sinh$) donne la courbe de la chaînette :\n$$y(x) = \\frac{1}{g\\frac{M}{LC}} \\cosh\\!\\left(g\\,\\frac{M}{LC}\\,x + A\\right) + B$$\nTrois inconnues ressortent de l'intégration — $A$, $B$, $C$ — fixées par trois faits que l'on connaît réellement : le câble passe par les deux points d'attache des pylônes, et sa longueur totale vaut $L$. $A$ se déduit directement comme un $\\mathrm{atanh}$ de la différence de hauteur sur $L$ ; $B$ et $C$ sont couplées dans une équation transcendante, donc résolues numériquement par Newton-Raphson plutôt que sous forme close.",
        "La courbe une fois résolue, les 25 pylônes sont placés le long de la droite $y = -10,75x + 315$ entre deux extrémités fixes, régulièrement espacés en $x$ ; getZ(x, y) fournit l'altitude de chacun pour qu'il repose bien sur le terrain, tourné selon la pente de la droite. Quel point d'attache d'un pylône se connecte à quel point du suivant est retrouvé dans une table de hachage (par exemple le point 4 avec le point 5, le point 2 avec le point 3), de sorte que les câbles s'attachent à la bonne hauteur et du bon côté plutôt que simplement de centre de pylône à centre de pylône.",
        { img: "images/geo-turbine-construction.png", alt: "L'éolienne construite à partir de courbes de Bézier en trois pièces indépendantes — le mât, la tête, et une pale — puis assemblées en la forme finale." },
        "Les éoliennes suivent le même principe de construction que les pylônes, mais avec des courbes de Bézier au lieu de segments mesurés en ligne droite : un mât (Holder), une tête (Head, la nacelle), et une pale, chacun modélisé séparément puis assemblé. Elles sont placées sur les sommets des collines, du côté opposé à la vallée par rapport aux pylônes, afin que l'énergie produite alimente la même ligne qui la fait descendre jusqu'au village.",
        "Le mener de bout en bout a permis d'appliquer des notions restées jusque-là théoriques — la méthode d'Euler et les fonctions hyperboliques se transformant en la forme réelle d'un câble suspendu — et de découvrir en chemin Adobe Illustrator comme un outil réellement utile pour un informaticien, pas seulement pour un designer."
      ],
      kab: [
        "Asenfar-a — ittwaxdem akked Ramy Sail, ittwasenced sɣur Capucine Nighem, deg useggas wis sin n Licence — yesbeggen amkan n tidet: alleɣ n Saint-Aubin, tqarrib i tesdawit, s wudem n uzemz 3D yellan s tira n tsura n tmurt, yeṭṭfen 25 pylônes n tzemmar, izenqan n tzemmar i ten-yeqqnen, akked iɛeggalen n waḍu (éoliennes) ɣef idurar i t-yezzin. Awennit-a ad yeddu ɣef urapport i nefka, ad iɛeddi ɣef ukkuẓ n tɣawsiwin i s-yefkan tazmert: shader n tmurt, tametka n pylônes, aslugen n uɣzis (altitude) i yeǧǧan yal taɣawsa ad tesɛeddi ɣef umnaḍ ur nemsaḍa ara, akked usekyed n tfizikt n catenary i d-yefkan i izenqan n tzemmar talɣa-nsen n tidet, mačči d izirig kan.",
        { img: "images/geo-hero-scene.jpg", alt: "Tanezduɣt taggarut: pylônes ṭafaren ajerriḍ n uzru, izenqan n tzemmar ṭṭfen ger-asen, akked snat iɛeggalen n waḍu deffir-sen ɣef uzru, akk ɣef tmurt n tidet n Saint-Aubin." },
        "Tamurt s timmad-is tekka-d seg isefka n uɣzis n tidet, ittwasekcem d amaslaḍ (mesh) anda z yezga gar -202.1 d -179.6, yeqreb ɣer 22 n tugniwin n telqey. Fragment shader yessunɣ tazrigt n uswir yal 1.1 n z (yeqreb ɣer 20 n tzerigin deg umḍan-a) yerna yessufeɣ azegzaw ɣef wayen yellan ddaw -198, isebgen amḍiq n telemmist anda yezga uɣrem.",
        { img: "images/geo-terrain-contours.jpg", alt: "Tamurt s tzerigin n uswir i d-yesuffeɣ shader, yal 1.1 n telqey n uɣzis." },
        "Yal pylône ittwaskan ɣef wa n tidet: nesqad tawlaft n tidet deg Adobe Illustrator iwakken ad naf kra n telqayin igejdanen — tuɣzi n lqaɛa, taɣzi n uqerru, tuɣzi n yiɣallen — nessufeɣ-d wiyaḍ s Pythagore akked Thalès mačči s usqad n yal taɣawsa s ufus. Mraw d yiwet n imukan n unekcum (attachment points) i yal pylône, yal yiwen d PVector, d imukan anida qqnen s tidet izenqan n tzemmar.",
        { img: "images/geo-pylon-geometry.png", alt: "Imukan n unekcum yettwacreḍen n pylône (Liaison1-13), yettusufeɣ-d seg kra n telqayin yettwasqadeɣ s Pythagore akked Thalès." },
        "Asers n yal taɣawsa ɣef tmurt — pylône, aɛeggal n waḍu, taggara n izenqan — yesra aɣzis-is deg (x, y) i yellan, tamurt d amaslaḍ n 9.999 n tiglizin (triangles). Deg umḍiq n usenqed n meṛṛa yal tikkelt, asekyed n “point-in-triangle” (asemsaḍ n triangles PBC, PCA, PAB s umḍan asemday) yettaf tiglizt yeṭṭfen, aɣzis d amḍan alemmas n z n krad iqerra-ines — asemsaḍ sḥel n wudem barycentric.",
        "Izenqan n tzemmar d tama yewɛaren nezha: akabel yeṭṭfen gar sin pylônes s telqayin ahat mgaraden yettader s tugna, aḍfar n tugna tameɣtut yesra tafra n wugur n tfizikt s tidet, mačči asezweg n uḍfar s spline. Deg umḍiq n uḥareb n wakabel ɣer wecwar ur nettwaḥsab, tira n tsertit tis-sin n Newton ɣef yiwen wecwar (tenṣert tettqadeṛ seg snat n tama, akked telɣi tettader, akud ur yettarra ara imi akabel deg lehna), tefka-d tira tanmegant i telɣa n wakabel:\n$$y''(x) = g\\,\\frac{M}{LC}\\,\\sqrt{1 + y'(x)^2}$$\nanda $M$ d azal n wakabel, $L$ d tuɣzi-ines, $C$ d tama tuffirt (ur nettwassen ara, tanmeɣlant) n tenṣert s tama tazerarant.",
        { img: "images/geo-catenary-forces.png", alt: "Tugna n tsertiyin i usekyed n catenary: awecwar ur nettwaḥsab n wakabel s tenṣert tettqadeṛ seg snat n tama akked telɣi tettader, akked triangles n tsertiyin yettwaxedmen i usemsaḍ ɣef assawal x akked y." },
        "Afra n tira-a (tarrayt tunṣibt: $y'(x)=u(x)$, tabḍa n tɣawsiwin, asnad n integral yellan d $\\sinh$) yefka-d azrig n catenary:\n$$y(x) = \\frac{1}{g\\frac{M}{LC}} \\cosh\\!\\left(g\\,\\frac{M}{LC}\\,x + A\\right) + B$$\nKrad n tɣawsiwin ur nettwassen ara d-yeffɣen seg tegrant — $A$, $B$, $C$ — ttwaseknen s krad n tɣawsiwin i nessen s tidet: akabel iɛeddi seg snat imukan n unekcum n pylônes, akked tuɣzi-is akmalan d $L$. $A$ d-yeffeɣ war ugur d $\\mathrm{atanh}$ n umgired n telqey ɣef $L$; $B$ akked $C$ mgabalent deg tira ur nezmir ara ad tettwafru s wudem asuf, dɣa fren-tent s Newton-Raphson s umḍan mačči s tira taflest.",
        "Deg tagara n ufra n uzrig, mraw d xemsa n pylônes ttwasersen sdaw uzrig $y = -10.75x + 315$ gar snat n tegrat yellan, mfaṛqen s wudem imṣadan deg x; getZ(x, y) yefka i yal yiwen aɣzis-is iwakken ad iqqim ɣef tmurt akken ilaq, yezzi akken i tɣara n uzrig. Anwa amḍiq n unekcum n pylône i yeqqnen ɣer wanwa amḍiq n wayeḍ ittwaf deg HashMap (am amḍiq 4 akked 5, amḍiq 2 akked 3), akken izenqan qqnen ɣer wemḍiq d telqey yelhan mačči kan seg lqaɛa ɣer lqaɛa n pylône.",
        { img: "images/geo-turbine-construction.png", alt: "Aɛeggal n waḍu yettwabnan s tzerigin Bézier deg krad n tɣawsiwin ur nemsebḍa (Holder, Head, akked yiwet n telɣa), imiren myussanen d talɣa taggarut." },
        "Iɛeggalen n waḍu ṭafaren adabu n usebni yiwen n win n pylônes, maca s tzerigin Bézier deg umḍiq n wecwaren yettwasqaden s wudem azirig: Holder (azgen n lqaɛa), Head (nacelle), akked yiwet n telɣa, yal yiwen ittwaskan weḥd-s syen myussanen. Ttwasersen ɣef inegzumen n idurar ɣer tama ur nella ara ɣer telemmist ɣef tama n pylônes, iwakken tazmert i d-ssufuɣen tečča ɣer yiwen n uzrig i tt-yessadren ɣer uɣrem.",
        "Aseddu-ines seg tazwara ɣer taggara yefka afaris n tɣawsiwin yeqqimen d tisertiyin kan — tarrayt n Euler akked twuriwin hyperboliques ulin d talɣa n tidet n wakabel yettadren — akked usnulfu, deg webrid-a, n Adobe Illustrator d afecku aqbaḥ i umsegdal, mačči kan i umeskar (designer)."
      ]
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/saint_aubin" }
    ],
    images: []
  },
  {
    slug: "pos-tagging",
    type: "project",
    title: {
      en: "Part-of-Speech Tagging on Universal Dependencies",
      fr: "Étiquetage morpho-syntaxique sur Universal Dependencies",
      kab: "Asekyed n Yiwalen (POS Tagging) ɣef Universal Dependencies"
    },
    period: { en: "Feb 2026", fr: "Févr. 2026", kab: "Fuṛar 2026" },
    summary: {
      en: "Part-of-speech tagging pipeline on the Universal Dependencies treebank, with a logistic-regression baseline.",
      fr: "Pipeline d'étiquetage morpho-syntaxique sur le treebank Universal Dependencies, avec une base de référence par régression logistique.",
      kab: "Pipeline n usekyed n yiwalen ɣef treebank n Universal Dependencies, s uslaḍ n tazwara s regression logistique."
    },
    description: {
      en: "Built a part-of-speech tagging pipeline on the Universal Dependencies English-EWT treebank (CoNLL-U format), with a logistic-regression baseline (scikit-learn) and a preprocessing pipeline (vocabulary building, sentence encoding, padding) for a neural sequence tagger.",
      fr: "Construction d'un pipeline d'étiquetage morpho-syntaxique (POS tagging) sur le treebank Universal Dependencies English-EWT (format CoNLL-U), avec une base de référence par régression logistique (scikit-learn) et un pipeline de prétraitement (vocabulaire, encodage des phrases, padding) pour un étiqueteur neuronal séquentiel.",
      kab: "Heggaɣ pipeline n usekyed n yiwalen (part-of-speech tagging) ɣef treebank n Universal Dependencies English-EWT (aɣanib CoNLL-U), s uslaḍ n tazwara s regression logistique (scikit-learn) akked pipeline n uheggi (asegzi n umawal, asekles n tefyar) i usekyad n uẓar amassan."
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/parts_of_speech" }
    ],
    images: []
  },
  {
    slug: "applied-statistics",
    type: "project",
    title: {
      en: "Bird Biodiversity Statistical Analysis",
      fr: "Analyse statistique de la biodiversité des oiseaux",
      kab: "Tasleḍt Tanadawit n Diversite Tabiologit n Igḍaḍ"
    },
    period: { en: "Oct - Nov 2025", fr: "Oct. - Nov. 2025", kab: "Tuber - Nunber 2025" },
    summary: {
      en: "Exploratory and statistical analysis of bird observation data in Martinique (2012-2025).",
      fr: "Analyse exploratoire et statistique de données d'observations d'oiseaux en Martinique (2012-2025).",
      kab: "Tasleḍt tanadawit n yisefka n twalatin n igḍaḍ deg Martinique (2012-2025)."
    },
    description: {
      en: "Team project (with Zineddine Kermadj and Amine Ouatmani) for an Applied Statistics course: exploratory and statistical analysis of bird observation data in Martinique (2012-2025), covering species distribution, temporal and spatial dynamics, biological indicators (species richness, mean abundance) and confidence intervals.",
      fr: "Projet d'équipe (avec Zineddine Kermadj et Amine Ouatmani) pour un cours de statistiques appliquées : analyse exploratoire et statistique de données d'observations d'oiseaux en Martinique (2012-2025), portant sur la distribution des espèces, les dynamiques temporelles et spatiales, des indicateurs biologiques (richesse spécifique, abondance moyenne) et des intervalles de confiance.",
      kab: "Asenfar n terbaɛt (akked Zineddine Kermadj d Amine Ouatmani) i uselmed n tsertit tanadawit (Applied Statistics): tasleḍt tanadawit n yisefka n twalatin n igḍaḍ deg Martinique (2012-2025), yesɛan tuzzya n twaculin, asnifel deg wakud d wadeg, asekyed abiologan (ṛṛay n twaculin, tamura talemmast) akked telwiyin n uɣtas."
    },
    links: [],
    images: []
  },
  {
    slug: "file-structure-ofa",
    type: "project",
    title: {
      en: "Indexed File Structures for a University Database",
      fr: "Structures de fichiers indexées pour une base de données universitaire",
      kab: "Tibnayin n Yifuyla s Index i Tesqamut n Tesdawit"
    },
    period: { en: "2023 - 2024", fr: "2023 - 2024", kab: "2023 - 2024" },
    summary: {
      en: "Database of Algerian university teaching staff using binary files with bitmap indexes.",
      fr: "Base de données des enseignants des universités algériennes à l'aide de fichiers binaires et d'index bitmap.",
      kab: "Tasqamut n iselmaden n tesdawiyin tizzayriyin s ifuyla imedduren akked index bitmap."
    },
    description: {
      en: "Designed a database of Algerian university teaching staff using binary files with indexes: fixed-size ordered block arrays for the data files and bitmap-structured index files, enabling fast, efficient operations on the data.",
      fr: "Conception d'une base de données des enseignants des universités algériennes à l'aide de fichiers binaires indexés : tableaux de blocs ordonnés de taille fixe pour les fichiers de données et fichiers d'index structurés en bitmap, permettant d'exécuter différentes opérations sur les données de manière rapide et efficace.",
      kab: "Heggaɣ tasqamut n iselmaden n tesdawiyin tizzayriyin s ifuyla imedduren s index: tirezzifin n yiḥricen yettwasnernin i tezmert tumesbanit i yifuyla n yisefka, akked ifuyla n index s tbenyi bitmap, i uxeddim aẓayan d ubaraz n yisefka."
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/File_Structure_OFA" }
    ],
    images: []
  },
  {
    slug: "kawa-interpreter",
    type: "project",
    title: {
      en: "Kawa Language Interpreter",
      fr: "Interpréteur du langage Kawa",
      kab: "Amsegzi n Tutlayt Kawa"
    },
    period: { en: "Dec 2024 - Feb 2025", fr: "Déc. 2024 - Févr. 2025", kab: "Dujember 2024 - Fuṛar 2025" },
    summary: {
      en: "Parser, type checker and interpreter for the Kawa language, with several language extensions.",
      fr: "Analyseur syntaxique, vérificateur de types et interpréteur pour le langage Kawa, avec plusieurs extensions.",
      kab: "Aẓrag n usentel, asenqed n twinasin akked umsegzi i tutlayt Kawa."
    },
    description: {
      en: "Implemented a parser, type checker and interpreter for the Kawa teaching language, extended with immutable fields, visibility modifiers, static fields, serial variable declarations and additional type tests.",
      fr: "Implémentation d'un analyseur syntaxique, d'un vérificateur de types et d'un interpréteur pour le langage pédagogique Kawa, étendu avec des champs immuables, des modificateurs de visibilité, des champs statiques, des déclarations en série et des tests de type supplémentaires.",
      kab: "Heggaɣ aẓrag n usentel (parser), asenqed n twinasin (type checker) akked umsegzi (interpreter) i tutlayt taselmadt Kawa, sɣerɣreɣ-t s izuran ur nettbeddil, tabadut n uskan, izuran ijgataen, ibeddilen n usentel s tfarrayt akked usekyed n twinasin nniḍen."
    },
    links: [
      { label: "GitHub", url: "https://github.com/Akawalid/kawa" }
    ],
    images: []
  }
];
