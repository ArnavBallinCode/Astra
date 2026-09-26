# Build an Interactive "Deep Learning + NLP University" From Scratch

I want you to build a **complete, deeply interactive educational website that teaches me Machine Learning, Deep Learning, Computer Vision, NLP, Transformers, LLMs, MLOps, and modern AI from absolute zero to advanced/master's-level understanding**.

This is NOT supposed to be a normal documentation website.

I want it to feel like a combination of:

* an interactive university course
* 3Blue1Brown-style visual intuition
* Distill-style interactive explanations
* a neural-network laboratory
* Jupyter notebooks
* a textbook
* LeetCode-style interactive exercises
* a visual debugger for AI models

The goal is:

> **After completing the entire website, I should be able to understand what is happening inside modern AI systems at the mathematical, algorithmic, architectural, implementation, and systems levels.**

Do not optimize for brevity.

Optimize for **complete understanding**.

---

# 1. THE CORE PRINCIPLE

Teach everything **from first principles**.

Never say:

> "This is how a neural network works."

and then show a diagram with arrows.

Instead, let me **see and manipulate every step**.

For example, when teaching a neuron:

INPUT:

x₁ = 0.7
x₂ = 0.2
x₃ = 0.9

WEIGHTS:

w₁ = 0.4
w₂ = -0.7
w₃ = 0.2

BIAS:

b = 0.1

Show the actual computation:

z = x₁w₁ + x₂w₂ + x₃w₃ + b

Then visually animate:

x₁ → multiply → w₁
x₂ → multiply → w₂
x₃ → multiply → w₃
↓
summation
↓
z
↓
activation
↓
y

Let me change x, weights, and bias using sliders and immediately see the output change.

Then show:

* what the neuron represents
* why weights exist
* why bias exists
* why nonlinear activation is necessary
* what happens without activation
* how multiple neurons form a layer
* how layers compose functions
* how information flows through the network

Every major concept should have this level of interactivity.

---

# 2. ABSOLUTE ZERO PREREQUISITES

Start from the assumption that the learner understands basic programming but knows almost nothing about deep learning.

Before neural networks, teach the mathematical foundations required.

## Mathematics

Build interactive modules for:

### Algebra

* variables
* equations
* functions
* graphs
* slopes
* linear functions
* nonlinear functions

### Vectors

Teach:

* vectors
* vector components
* vector addition
* scalar multiplication
* dot product
* geometric interpretation
* vector magnitude
* normalization
* cosine similarity

Create interactive vector visualizations where I can drag vectors around.

### Matrices

Teach:

* matrices
* dimensions
* matrix addition
* scalar multiplication
* matrix multiplication
* transpose
* inverse
* identity matrix
* linear transformations
* eigenvalues
* eigenvectors

Let me manipulate matrices visually.

Show exactly how matrix multiplication works:

A × B

and highlight individual multiplication and accumulation operations.

### Calculus

Teach:

* functions
* limits intuitively
* derivatives
* partial derivatives
* gradients
* chain rule
* directional derivatives
* gradient descent

Create an interactive 2D loss landscape.

Let me drag a point around and visualize:

gradient → direction → parameter update → new loss.

Then extend this to 3D.

### Probability

Teach:

* probability
* random variables
* distributions
* expectation
* variance
* conditional probability
* Bayes theorem
* likelihood
* probability density
* entropy
* cross entropy
* KL divergence

All with interactive visualizations.

---

# 3. MACHINE LEARNING FOUNDATIONS

Teach classical ML before deep learning.

Cover:

* supervised learning
* unsupervised learning
* semi-supervised learning
* self-supervised learning
* reinforcement learning

Algorithms:

* linear regression
* logistic regression
* k-NN
* decision trees
* random forests
* gradient boosting
* SVM
* k-means
* PCA
* Naive Bayes

For each algorithm explain:

1. intuition
2. mathematical formulation
3. training
4. inference
5. loss/objective
6. optimization
7. computational complexity
8. strengths
9. weaknesses
10. practical applications

---

# 4. NEURAL NETWORKS FROM THE GROUND UP

This section needs to be EXTREMELY detailed.

Teach:

## Single neuron

* perceptron
* weighted sum
* bias
* activation
* decision boundary

## Activation functions

Interactive plots for:

* sigmoid
* tanh
* ReLU
* Leaky ReLU
* ELU
* GELU
* SiLU / Swish
* Softmax

Show:

* equation
* graph
* derivative
* numerical behavior
* why/when it is used

---

# 5. MULTI-LAYER PERCEPTRONS

Build a fully interactive neural network.

Allow the learner to:

* add neurons
* remove neurons
* add layers
* change weights
* change biases
* select activation functions
* enter input values

Then animate forward propagation.

Show every numerical operation.

Example:

Layer 1:

x → W₁x + b₁ → activation

Layer 2:

h₁ → W₂h₁ + b₂ → activation

Output:

h₂ → W₃h₂ + b₃

Do not hide matrix operations.

Allow the learner to expand a matrix multiplication and inspect individual scalar operations.

---

# 6. FORWARD PROPAGATION

Teach exactly:

X

↓

Z = WX + b

↓

A = activation(Z)

↓

next layer

↓

output

Explain:

* dimensions
* broadcasting
* tensors
* batch dimensions
* computational graphs

Allow the learner to inspect tensor shapes at every stage.

---

# 7. LOSS FUNCTIONS

Teach:

* MSE
* MAE
* binary cross entropy
* categorical cross entropy
* sparse categorical cross entropy
* hinge loss
* negative log likelihood
* contrastive loss
* triplet loss
* KL divergence
* cosine losses

For each:

* intuition
* equation
* graph
* derivative
* numerical example
* practical use

---

# 8. BACKPROPAGATION

This should be one of the most detailed sections on the entire website.

I want to understand backpropagation so deeply that I can derive it myself.

Start with a single computational graph.

Example:

x → multiply → add → sigmoid → loss

Then calculate:

∂L/∂x

step by step.

Visualize the chain rule.

Then expand:

single neuron

→ two neurons

→ one hidden layer

→ multiple layers

Explain:

* local gradients
* upstream gradients
* downstream gradients
* computational graphs
* chain rule
* Jacobians
* vector-Jacobian products

Show gradients flowing backward visually.

---

# 9. GRADIENT DESCENT

Interactive loss landscape.

Show:

θ₀

↓

calculate gradient

↓

θ₁ = θ₀ - η∇L

↓

new loss

↓

repeat

Allow sliders for:

* learning rate
* momentum
* initial position

Visualize:

* too small learning rate
* too large learning rate
* oscillation
* convergence
* saddle points
* local minima
* plateaus

---

# 10. OPTIMIZERS

Teach in extreme detail:

* SGD
* Momentum
* Nesterov
* AdaGrad
* RMSProp
* Adam
* AdamW
* Lion

Show exactly how each parameter update is calculated.

Compare optimization trajectories visually.

---

# 11. TRAINING A REAL NETWORK

Build an interactive training playground.

Dataset examples:

* XOR
* circles
* moons
* spirals
* MNIST

Allow:

* selecting architecture
* selecting activation
* selecting optimizer
* changing learning rate
* changing batch size
* changing epochs

Show live:

* loss
* accuracy
* decision boundary
* weights
* gradients
* activations

Add a "STEP ONE ITERATION" button.

When clicked:

1. forward pass
2. loss
3. backward pass
4. gradients
5. optimizer update

Animate everything.

---

# 12. WHY DEEP NETWORKS WORK

Teach:

* representation learning
* hierarchical representations
* feature extraction
* universal approximation
* compositionality
* depth vs width
* expressivity
* inductive bias

Visualize progressively learned features.

---

# 13. CNNs / COMPUTER VISION

Teach image representation first.

Explain:

* pixels
* RGB
* tensors
* channels
* height
* width

Then convolution.

Create an interactive convolution playground.

Display:

IMAGE MATRIX

and

KERNEL

Let the learner move the kernel across the image.

At every position show:

element-wise multiplication

↓

summation

↓

output pixel

Teach:

* stride
* padding
* receptive fields
* channels
* feature maps
* kernels
* pooling
* max pooling
* average pooling
* dilation

Then architectures:

* LeNet
* AlexNet
* VGG
* GoogLeNet
* ResNet
* DenseNet
* EfficientNet
* Vision Transformers

Explain residual connections visually.

---

# 14. COMPUTER VISION

Cover:

* image classification
* object detection
* semantic segmentation
* instance segmentation
* image generation
* embeddings
* OCR
* face recognition
* image similarity

Architectures:

* YOLO
* Faster R-CNN
* U-Net
* Mask R-CNN
* ViT
* CLIP
* diffusion models

Explain the complete inference pipeline.

---

# 15. RNNs

Start from sequence problems.

Explain why ordinary neural networks struggle with sequences.

Then:

* RNN
* hidden state
* recurrence
* sequence processing

Visualize:

x₁ → RNN → h₁
x₂ → RNN → h₂
x₃ → RNN → h₃

Show how information travels through time.

---

# 16. VANISHING AND EXPLODING GRADIENTS

Make this highly interactive.

Show gradients being repeatedly multiplied.

Let me change:

* activation
* sequence length
* weights

and watch the gradient shrink or explode.

Explain exactly why this happens.

---

# 17. LSTM

Teach LSTM from scratch.

Do NOT just show the standard LSTM diagram.

Break it into individual gates:

* forget gate
* input gate
* candidate state
* cell state
* output gate

For every gate show:

equation

↓

numerical example

↓

visual interpretation

↓

effect on memory

Let the learner manipulate:

forget gate activation

input gate activation

output gate activation

and watch the cell state change.

---

# 18. GRU

Teach:

* update gate
* reset gate
* hidden state

Compare GRU vs LSTM.

---

# 19. NLP FROM ZERO

Start with:

"What actually is language from the perspective of a computer?"

Teach:

* text
* characters
* words
* tokens
* vocabulary
* token IDs
* sequences

---

# 20. TOKENIZATION

Interactive tokenizer.

Show:

"The cat is sleeping."

↓

tokens

↓

token IDs

↓

embeddings

Cover:

* whitespace tokenization
* character tokenization
* word tokenization
* BPE
* WordPiece
* SentencePiece
* Unigram

Explain exactly how BPE learns merges.

Let me run BPE manually on a tiny vocabulary.

---

# 21. WORD EMBEDDINGS

Teach:

* one-hot vectors
* word2vec
* CBOW
* Skip-gram
* negative sampling
* GloVe

Visualize embeddings in 2D/3D.

Show semantic relationships.

Explain why embeddings capture meaning.

---

# 22. SEQUENCE-TO-SEQUENCE

Teach:

* encoder
* decoder
* teacher forcing
* autoregressive generation

Build a tiny translation example.

---

# 23. ATTENTION

This must be extremely detailed.

Start WITHOUT transformers.

Explain the problem attention solves.

Then derive attention mathematically.

Show:

Query

Key

Value

Explain each intuitively.

Then:

score(Q,K)

↓

softmax

↓

attention weights

↓

weighted sum of V

Create a fully interactive attention matrix.

Let the user hover over each value and see exactly where it came from.

---

# 24. SELF-ATTENTION

Teach:

Input embeddings

↓

WQ

WK

WV

↓

Q K V

↓

QKᵀ

↓

scale by √dₖ

↓

softmax

↓

attention weights

↓

weighted values

↓

output

Every matrix multiplication must be expandable.

Show actual numbers for a tiny example.

Allow users to change the input token and watch attention change.

---

# 25. MULTI-HEAD ATTENTION

Explain:

Why multiple heads?

What does a head learn?

Show each head separately.

Example:

Head 1 → syntactic relationship

Head 2 → positional relationship

Head 3 → semantic relationship

Then concatenate:

head₁ || head₂ || ... || headₕ

↓

Wᵒ

↓

output

---

# 26. TRANSFORMERS

Build a complete Transformer visually.

Explain:

Embedding

↓

Positional encoding

↓

Multi-head self-attention

↓

Add & Norm

↓

Feed-forward network

↓

Add & Norm

↓

next layer

Teach:

* encoder
* decoder
* encoder-decoder transformer
* decoder-only transformer

Explain causal masking visually.

---

# 27. POSITIONAL INFORMATION

Teach:

* sinusoidal positional encoding
* learned positional embeddings
* relative position
* RoPE
* ALiBi

Show exactly how position information is injected.

---

# 28. TRANSFORMER FFN

Explain:

Linear

↓

activation

↓

Linear

Explain why it exists and how it differs from attention.

Cover:

* ReLU
* GELU
* SwiGLU

---

# 29. NORMALIZATION

Teach:

* batch normalization
* layer normalization
* RMSNorm

Show actual calculations.

Explain pre-norm vs post-norm.

---

# 30. LANGUAGE MODELING

Explain:

What exactly is a language model?

P(next token | previous tokens)

Build a tiny language model.

Show probability distributions over the next token.

---

# 31. AUTOREGRESSIVE GENERATION

Visualize:

prompt

↓

model

↓

probabilities

↓

token selection

↓

append token

↓

model again

↓

repeat

Explain:

* greedy decoding
* temperature
* top-k
* top-p / nucleus sampling
* repetition penalty
* beam search

Let users manipulate temperature and watch the probability distribution change.

---

# 32. GPT

Explain GPT architecture from the ground up.

Cover:

* decoder-only transformer
* causal attention
* token embeddings
* positional encoding
* transformer blocks
* LM head
* logits
* softmax
* next-token prediction

Show the complete pipeline.

---

# 33. TRAINING AN LLM

Explain the complete lifecycle:

Dataset

↓

cleaning

↓

deduplication

↓

tokenization

↓

training examples

↓

forward pass

↓

loss

↓

backpropagation

↓

optimizer

↓

checkpoint

↓

evaluation

Teach:

* pretraining
* next-token prediction
* distributed training
* mixed precision
* gradient accumulation
* gradient clipping
* checkpointing

---

# 34. SLMs AND LLMs

Explain:

* what makes an LLM an LLM
* SLMs
* parameter count
* model size
* context length
* inference cost
* latency
* memory requirements

Explain quantization:

* FP32
* FP16
* BF16
* INT8
* INT4

Explain:

* pruning
* distillation
* LoRA
* QLoRA

---

# 35. LLM FINE-TUNING

Teach:

* pretraining
* supervised fine-tuning
* instruction tuning
* RLHF
* preference optimization
* DPO
* PPO
* reward models

Explain each mathematically and architecturally.

---

# 36. RAG

Teach Retrieval Augmented Generation from scratch.

Pipeline:

Documents

↓

chunking

↓

embeddings

↓

vector database

↓

retrieval

↓

context

↓

LLM

↓

answer

Explain:

* embeddings
* vector similarity
* cosine similarity
* ANN search
* FAISS
* HNSW
* reranking
* hybrid search
* chunking strategies

Build an interactive RAG demo.

---

# 37. AGENTS

Teach:

* tool calling
* function calling
* planning
* memory
* reflection
* workflows
* agent loops
* multi-agent systems

Show:

User

↓

Agent

↓

reasoning/planning

↓

tool

↓

result

↓

agent

↓

final response

---

# 38. MULTIMODAL AI

Teach:

* text
* image
* audio
* video

Cover:

* CLIP
* vision-language models
* speech recognition
* text-to-speech
* multimodal transformers

---

# 39. DIFFUSION MODELS

Teach from scratch:

* noise
* forward diffusion
* reverse diffusion
* denoising
* score estimation
* U-Net
* latent diffusion
* text conditioning

Create an interactive diffusion visualization.

---

# 40. REINFORCEMENT LEARNING

Teach:

* agent
* environment
* state
* action
* reward
* policy
* value function
* Q function

Algorithms:

* Q-learning
* DQN
* policy gradients
* actor-critic
* PPO

---

# 41. MODEL EVALUATION

Teach:

Classification:

* accuracy
* precision
* recall
* F1
* ROC-AUC
* confusion matrix

NLP:

* perplexity
* BLEU
* ROUGE
* BERTScore
* human evaluation

LLMs:

* instruction following
* factuality
* hallucination
* reasoning evaluation
* safety evaluation

---

# 42. INTERPRETABILITY

Teach:

* feature importance
* saliency
* activation visualization
* attention visualization
* integrated gradients
* SHAP
* mechanistic interpretability
* activation patching
* circuits

---

# 43. ML ENGINEERING

Teach everything required to actually deploy ML systems.

Cover:

* data pipelines
* training pipelines
* experiment tracking
* model registry
* feature stores
* model serving
* batching
* caching
* monitoring
* logging
* drift
* retraining
* A/B testing

---

# 44. MLOPS

Build an entire MLOps lifecycle diagram:

Data

↓

Training

↓

Validation

↓

Registry

↓

Deployment

↓

Monitoring

↓

Feedback

↓

Retraining

Teach:

* Docker
* Kubernetes
* CI/CD
* model versioning
* MLflow
* inference servers
* GPUs
* distributed training
* cloud deployment

---

# 45. SYSTEMS FOR LLMs

Go deeper into infrastructure.

Teach:

* GPU architecture basics
* CUDA concepts
* memory bandwidth
* FLOPs
* batching
* KV cache
* continuous batching
* speculative decoding
* tensor parallelism
* pipeline parallelism
* data parallelism

Explain why LLM inference is expensive.

---

# 46. KV CACHE

Give KV cache its own interactive visualization.

Show:

Token 1

↓

K₁ V₁

Token 2

↓

K₂ V₂

etc.

Then show why previous K/V values don't need to be recomputed during autoregressive generation.

---

# 47. MODERN LLM INFERENCE

Teach:

* vLLM
* PagedAttention
* batching
* quantization
* model serving
* latency vs throughput
* tokens/sec
* time to first token

---

# 48. RESEARCH-LEVEL TOPICS

After the main curriculum, create an "Advanced / Research" section.

Teach:

* scaling laws
* emergent behavior
* mixture of experts
* sparse models
* MoE routing
* long-context models
* retrieval models
* state-space models
* Mamba
* speculative decoding
* reasoning models
* test-time compute
* model compression
* mechanistic interpretability
* alignment
* AI safety

---

# 49. IMPLEMENTATION LABS

Every major section should contain coding laboratories.

Examples:

### Lab 1

Implement a neuron using NumPy.

### Lab 2

Implement forward propagation.

### Lab 3

Implement backpropagation from scratch.

### Lab 4

Implement gradient descent.

### Lab 5

Train an MLP on XOR.

### Lab 6

Implement convolution.

### Lab 7

Implement an RNN.

### Lab 8

Implement an LSTM.

### Lab 9

Implement tokenization.

### Lab 10

Implement word embeddings.

### Lab 11

Implement attention.

### Lab 12

Implement self-attention.

### Lab 13

Implement multi-head attention.

### Lab 14

Implement a Transformer.

### Lab 15

Train a tiny language model.

### Lab 16

Build a tiny GPT.

### Lab 17

Build a RAG system.

### Lab 18

Deploy an ML model.

All implementations should preferably be understandable from first principles.

---

# 50. VISUAL DESIGN

Make the website visually beautiful.

Dark/light mode.

Excellent typography.

Smooth animations.

Interactive diagrams.

Neural network visualizations.

Mathematical notation rendered cleanly with KaTeX/MathJax.

Charts.

Sliders.

Draggable nodes.

Expandable calculations.

Step-by-step execution.

Progress indicators.

Interactive quizzes.

Code playgrounds.

Don't make it look like a boring university PDF converted into HTML.

It should feel like an actual **AI laboratory**.

---

# 51. LEARNING EXPERIENCE

Every lesson should follow this structure:

## 1. Intuition

Explain the idea without mathematics.

## 2. Visual

Show it interactively.

## 3. Mathematics

Derive the equations.

## 4. Numerical Example

Use actual numbers.

## 5. Implementation

Implement it.

## 6. Experiment

Let the learner change parameters.

## 7. Common Mistakes

Explain misconceptions.

## 8. Why It Matters

Connect it to modern AI.

## 9. Quiz

Test understanding.

## 10. Challenge

Give a problem that requires applying the concept.

---

# 52. "SHOW ME WHAT IS ACTUALLY HAPPENING"

Everywhere possible, include a button:

**"Show internal computation"**

When clicked, expose the hidden operations.

For example, for a Transformer:

Input tokens

↓

token IDs

↓

embeddings

↓

Q/K/V

↓

QKᵀ

↓

scaling

↓

mask

↓

softmax

↓

weighted values

↓

concatenation

↓

output projection

↓

residual

↓

normalization

↓

FFN

↓

residual

↓

normalization

Do not abstract away the important parts.

---

# 53. KNOWLEDGE GRAPH

Create a visual map of the entire curriculum.

For example:

Mathematics

↓

Machine Learning

↓

Neural Networks

↓

CNN / RNN

↓

Attention

↓

Transformers

↓

LLMs

↓

RAG / Agents / Multimodal AI

Clicking a concept should show:

* prerequisites
* concepts it unlocks
* lessons
* labs
* quizzes

---

# 54. MASTERY SYSTEM

Track what I have learned.

Each concept gets a mastery level:

Not Started

↓

Learning

↓

Practicing

↓

Understood

↓

Mastered

Don't just track whether I opened a page.

Track quiz performance and interactive exercises.

---

# 55. GLOSSARY

Create a huge searchable glossary.

Terms like:

Neuron
Weight
Bias
Activation
Gradient
Backpropagation
Embedding
Token
Attention
Query
Key
Value
Logit
Softmax
Transformer
Context Window
KV Cache
LoRA
RAG
etc.

Each term should link back to the relevant lessons.

---

# 56. "WHY?" BUTTON

For difficult concepts, provide a persistent:

**WHY?**

button.

Example:

Why divide attention scores by √dₖ?

Clicking it should explain the mathematical reason and show what happens without scaling.

Similarly:

Why softmax?

Why nonlinear activations?

Why residual connections?

Why layer normalization?

Why multiple attention heads?

Why positional encoding?

Why causal masking?

This should be one of the defining features of the website.

---

# 57. "TRACE ONE TOKEN"

Create an amazing feature where I can select a token and follow it through the entire model.

Example:

"The"

↓

token ID

↓

embedding

↓

attention

↓

head 1

↓

head 2

↓

...

↓

FFN

↓

next Transformer block

↓

...

↓

logits

↓

probability

↓

next token

This should make the internal mechanics of an LLM tangible.

---

# 58. "BUILD YOUR OWN GPT"

Eventually provide a guided project:

Build a tiny GPT from scratch.

The learner should implement:

* tokenizer
* embeddings
* positional representation
* attention
* multi-head attention
* transformer block
* causal masking
* FFN
* normalization
* LM head
* loss
* backpropagation
* optimizer
* training loop
* generation

Then let the learner train it on a tiny dataset.

---

# 59. IMPORTANT: DO NOT CHEAT THE CURRICULUM

Do not skip topics just because they are difficult.

Do not write:

"Transformers are beyond the scope of this course."

Nothing is beyond scope.

If a concept requires another concept, teach the prerequisite first.

Build a dependency graph.

---

# 60. DEPTH REQUIREMENT

For every major topic, I want at least:

* intuitive explanation
* visual explanation
* mathematical explanation
* numerical example
* implementation
* interactive experiment
* quiz
* challenge
* common misconceptions
* real-world application

For major topics such as:

* backpropagation
* CNNs
* RNNs
* LSTMs
* attention
* self-attention
* transformers
* LLMs

go significantly deeper.

---

# 61. TECHNICAL REQUIREMENTS

Build this as a real functioning website, not a static mockup.

Use a modern frontend stack.

Prefer:

* React
* TypeScript
* Tailwind
* modern component architecture
* KaTeX/MathJax
* D3.js / SVG / Canvas for visualizations
* interactive code execution where practical

Keep the architecture modular.

Lessons should be data-driven so that new lessons can be added without rewriting the application.

---

# 62. PERFORMANCE

The website should remain responsive even with complex visualizations.

Use:

* lazy loading
* code splitting
* efficient canvas/SVG rendering
* Web Workers where useful
* memoization
* virtualized content when necessary

Don't render massive neural-network visualizations unnecessarily.

---

# 63. OFFLINE-FIRST

Whenever possible, the core educational content should work locally.

Avoid requiring an expensive API for basic lessons.

The interactive mathematics and simulations should run in the browser whenever possible.

---

# 64. CURRICULUM ORDER

The learning path should roughly be:

### LEVEL 0

Programming + Mathematics

### LEVEL 1

Machine Learning Foundations

### LEVEL 2

Neural Networks

### LEVEL 3

Deep Learning

### LEVEL 4

CNN + Computer Vision

### LEVEL 5

RNN + Sequence Models

### LEVEL 6

NLP Foundations

### LEVEL 7

Attention

### LEVEL 8

Transformers

### LEVEL 9

LLMs

### LEVEL 10

Generative AI

### LEVEL 11

RAG + Agents

### LEVEL 12

Multimodal AI

### LEVEL 13

MLOps

### LEVEL 14

AI Systems

### LEVEL 15

Research-Level Deep Learning

---

# 65. THE FINAL STANDARD

The final website should make it possible for me to answer questions such as:

"Why does backpropagation work?"

"Why do gradients vanish?"

"How exactly does an LSTM remember something?"

"How does convolution actually detect features?"

"Why does attention use Q, K and V?"

"What exactly happens when GPT receives a prompt?"

"How is a token converted into an embedding?"

"How does self-attention calculate its output?"

"Why divide QKᵀ by √dₖ?"

"How does c
