#!/usr/bin/env python3
"""
ClearCase Legal Knowledge Base Ingestion Engine
==============================================
Ingests statutory legal acts (UP Revenue Code, Minimum Wages Act, Tenancy Act, Easements Act, etc.),
chunks them into semantic units, generates vector embeddings (Amazon Bedrock Titan or local
SentenceTransformers/fallback), and indexes them into OpenSearch / Chroma / Local Vector Store.
"""

import os
import re
import json
import glob
import math
import hashlib
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, asdict

# ------------------------------------------------------------------------------
# 1. Chunk Data Structure
# ------------------------------------------------------------------------------

@dataclass
class LegalChunk:
    chunk_id: str
    act_name: str
    section: str
    clause_title: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        return d


# ------------------------------------------------------------------------------
# 2. Embedding Client Interface & Implementations
# ------------------------------------------------------------------------------

class EmbeddingClient:
    """Abstract interface for generating vector embeddings."""
    def get_embedding(self, text: str) -> List[float]:
        raise NotImplementedError

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        return [self.get_embedding(t) for t in texts]


class BedrockTitanEmbeddingClient(EmbeddingClient):
    """
    Amazon Bedrock Titan Embeddings client (amazon.titan-embed-text-v1 / v2).
    Requires AWS credentials in environment or IAM role.
    """
    def __init__(self, model_id: str = "amazon.titan-embed-text-v1", region: str = "ap-south-1"):
        import boto3
        self.model_id = os.getenv("BEDROCK_EMBEDDING_MODEL_ID", model_id)
        self.region = os.getenv("AWS_REGION", region)
        self.client = boto3.client("bedrock-runtime", region_name=self.region)
        print(f"[BedrockTitanEmbeddingClient] Initialized with model: {self.model_id} in {self.region}")

    def get_embedding(self, text: str) -> List[float]:
        cleaned_text = text.replace("\n", " ").strip()[:8192]
        payload = json.dumps({"inputText": cleaned_text})
        response = self.client.invoke_model(
            modelId=self.model_id,
            contentType="application/json",
            accept="application/json",
            body=payload
        )
        body = json.loads(response["body"].read().decode("utf-8"))
        return body["embedding"]


class LocalSentenceTransformerEmbeddingClient(EmbeddingClient):
    """
    Local SentenceTransformer embeddings using Hugging Face models
    (e.g., 'all-MiniLM-L6-v2' or 'paraphrase-multilingual-MiniLM-L12-v2').
    """
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        from sentence_transformers import SentenceTransformer
        self.model_name = os.getenv("LOCAL_EMBEDDING_MODEL", model_name)
        print(f"[LocalSentenceTransformerEmbeddingClient] Loading model: {self.model_name}...")
        self.model = SentenceTransformer(self.model_name)
        print(f"[LocalSentenceTransformerEmbeddingClient] Loaded successfully.")

    def get_embedding(self, text: str) -> List[float]:
        emb = self.model.encode(text, normalize_embeddings=True)
        return emb.tolist()

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        embs = self.model.encode(texts, normalize_embeddings=True, batch_size=16)
        return [e.tolist() for e in embs]


class DeterministicFallbackEmbeddingClient(EmbeddingClient):
    """
    Zero-network, zero-download 384-dimensional deterministic feature hash vectorizer.
    Guarantees instant local fallback for hackathon demos when offline or behind firewalls.
    """
    def __init__(self, dim: int = 384):
        self.dim = dim
        print(f"[DeterministicFallbackEmbeddingClient] Initialized (dim={self.dim}, zero-dependency).")

    def get_embedding(self, text: str) -> List[float]:
        vec = [0.0] * self.dim
        stopwords = {"in", "the", "of", "and", "to", "a", "is", "that", "for", "on", "with", "as", "by", "at", "from", "it", "an", "be", "this", "which", "or", "all", "any", "no", "not", "act"}
        tokens = [w for w in re.findall(r"\w+", text.lower()) if w not in stopwords and len(w) > 1]
        if not tokens:
            return vec
        for token in tokens:
            h = hashlib.md5(token.encode("utf-8")).hexdigest()
            idx = int(h, 16) % self.dim
            sign = 1.0 if (int(h[:2], 16) & 1) else -1.0
            vec[idx] += sign
        # L2 normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec


def get_embedding_client(provider: Optional[str] = None) -> EmbeddingClient:
    """Factory to instantiate the appropriate embedding client with automated fallback."""
    provider = provider or os.getenv("EMBEDDING_PROVIDER", "auto").lower()

    if provider == "bedrock":
        try:
            return BedrockTitanEmbeddingClient()
        except Exception as e:
            print(f"[EmbeddingFactory] Bedrock initialization failed ({e}). Falling back to local/stub.")

    if provider in ("local", "sentence-transformers", "auto"):
        try:
            # Check if sentence_transformers is readily usable
            return LocalSentenceTransformerEmbeddingClient()
        except Exception as e:
            print(f"[EmbeddingFactory] SentenceTransformers failed ({e}). Using deterministic fallback.")

    return DeterministicFallbackEmbeddingClient()


# ------------------------------------------------------------------------------
# 3. Legal Text Chunking Engine
# ------------------------------------------------------------------------------

def chunk_markdown_legal_file(file_path: str, chunk_token_limit: int = 400, overlap: int = 50) -> List[LegalChunk]:
    """
    Parses a statutory markdown file, extracts Act title, section headers,
    and creates overlapping semantic chunks (~300-500 words).
    """
    with open(file_path, "r", encoding="utf-8") as f:
        raw_content = f.read()

    # Extract Act Title from first # header or filename
    act_title_match = re.search(r"^#\s+(.+)$", raw_content, re.MULTILINE)
    default_act = os.path.splitext(os.path.basename(file_path))[0].replace("_", " ").title()
    act_title = act_title_match.group(1).strip() if act_title_match else default_act

    chunks: List[LegalChunk] = []

    # Split on Section headers: ### Section <num>: <title>
    section_blocks = re.split(r"(?=\n###\s+Section|\n###\s+Code\s+of\s+Civil)", raw_content)

    for b_idx, block in enumerate(section_blocks):
        block = block.strip()
        if not block:
            continue

        # Look for section and clause title
        sec_match = re.search(r"###\s+(Section\s+[0-9A-Za-z]+|Code\s+of\s+Civil\s+Procedure[^\n:]*):\s*([^\n]+)", block)
        if sec_match:
            sec_num = sec_match.group(1).strip()
            clause_title = sec_match.group(2).strip()
        else:
            sec_num = f"General Provision {b_idx + 1}"
            clause_title = act_title

        # Break long sections into overlapping sub-chunks if text exceeds chunk_token_limit words
        words = block.split()
        if len(words) <= chunk_token_limit:
            sub_blocks = [block]
        else:
            sub_blocks = []
            step = chunk_token_limit - overlap
            for start in range(0, len(words), step):
                window = words[start : start + chunk_token_limit]
                sub_text = " ".join(window)
                sub_blocks.append(sub_text)
                if start + chunk_token_limit >= len(words):
                    break

        for s_idx, text_chunk in enumerate(sub_blocks):
            sub_id = f"{os.path.basename(file_path).split('.')[0]}_{b_idx}_{s_idx}"
            metadata = {
                "source_file": os.path.basename(file_path),
                "act_name": act_title,
                "section": sec_num,
                "clause_title": clause_title,
                "word_count": len(text_chunk.split())
            }
            chunks.append(LegalChunk(
                chunk_id=sub_id,
                act_name=act_title,
                section=sec_num,
                clause_title=clause_title,
                content=text_chunk,
                metadata=metadata
            ))

    return chunks


# ------------------------------------------------------------------------------
# 4. Vector Store Interface & Local / Chroma Fallbacks
# ------------------------------------------------------------------------------

class VectorStoreClient:
    """Abstract interface for vector indexing and semantic similarity query."""
    def add_chunks(self, chunks: List[LegalChunk]) -> None:
        raise NotImplementedError

    def search(self, query_embedding: List[float], top_k: int = 3) -> List[Tuple[LegalChunk, float]]:
        raise NotImplementedError

    def count(self) -> int:
        raise NotImplementedError


class LocalJsonVectorStore(VectorStoreClient):
    """
    Lightweight, persistent, NumPy-based cosine similarity vector store.
    Saves to local JSON file. 100% offline, zero-network, reliable on any OS.
    """
    def __init__(self, index_path: str = "data/local_vector_index.json"):
        self.index_path = index_path
        self.chunks: List[LegalChunk] = []
        self._load()

    def _load(self):
        if os.path.exists(self.index_path):
            try:
                with open(self.index_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.chunks = [
                        LegalChunk(
                            chunk_id=item["chunk_id"],
                            act_name=item["act_name"],
                            section=item["section"],
                            clause_title=item["clause_title"],
                            content=item["content"],
                            metadata=item.get("metadata", {}),
                            embedding=item.get("embedding")
                        )
                        for item in data
                    ]
                print(f"[LocalJsonVectorStore] Loaded {len(self.chunks)} chunks from {self.index_path}")
            except Exception as e:
                print(f"[LocalJsonVectorStore] Warning: Could not load index ({e})")

    def _save(self):
        os.makedirs(os.path.dirname(self.index_path) or ".", exist_ok=True)
        with open(self.index_path, "w", encoding="utf-8") as f:
            json.dump([c.to_dict() for c in self.chunks], f, indent=2)
        print(f"[LocalJsonVectorStore] Saved {len(self.chunks)} chunks to {self.index_path}")

    def add_chunks(self, chunks: List[LegalChunk]) -> None:
        chunk_map = {c.chunk_id: c for c in self.chunks}
        for c in chunks:
            chunk_map[c.chunk_id] = c
        self.chunks = list(chunk_map.values())
        self._save()

    def search(self, query_embedding: List[float], top_k: int = 3) -> List[Tuple[LegalChunk, float]]:
        import numpy as np

        if not self.chunks or not query_embedding:
            return []

        q_vec = np.array(query_embedding, dtype=np.float32)
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            q_norm = 1.0

        scores: List[Tuple[LegalChunk, float]] = []
        for chunk in self.chunks:
            if chunk.embedding is None:
                continue
            c_vec = np.array(chunk.embedding, dtype=np.float32)
            c_norm = np.linalg.norm(c_vec)
            if c_norm == 0:
                c_norm = 1.0
            cos_sim = float(np.dot(q_vec, c_vec) / (q_norm * c_norm))
            # Normalize to 0..1 scale
            normalized_score = max(0.0, min(1.0, (cos_sim + 1.0) / 2.0))
            scores.append((chunk, normalized_score))

        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]

    def count(self) -> int:
        return len(self.chunks)


class ChromaVectorStore(VectorStoreClient):
    """
    ChromaDB persistent vector store.
    """
    def __init__(self, persist_dir: str = "./chroma_db", collection_name: str = "clearcase_statutes"):
        import chromadb
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "ClearCase Statutory Law Index"}
        )
        print(f"[ChromaVectorStore] Initialized Chroma collection '{collection_name}' at '{persist_dir}'.")

    def add_chunks(self, chunks: List[LegalChunk]) -> None:
        ids = [c.chunk_id for c in chunks]
        documents = [c.content for c in chunks]
        embeddings = [c.embedding for c in chunks]
        metadatas = [
            {
                "act_name": c.act_name,
                "section": c.section,
                "clause_title": c.clause_title,
                "source_file": c.metadata.get("source_file", "")
            }
            for c in chunks
        ]
        self.collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )
        print(f"[ChromaVectorStore] Upserted {len(chunks)} chunks into ChromaDB.")

    def search(self, query_embedding: List[float], top_k: int = 3) -> List[Tuple[LegalChunk, float]]:
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        output: List[Tuple[LegalChunk, float]] = []
        if not results or not results["ids"] or not results["ids"][0]:
            return output

        ids = results["ids"][0]
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results.get("distances", [[0.0] * len(ids)])[0]

        for i in range(len(ids)):
            meta = metas[i] or {}
            chunk = LegalChunk(
                chunk_id=ids[i],
                act_name=meta.get("act_name", ""),
                section=meta.get("section", ""),
                clause_title=meta.get("clause_title", ""),
                content=docs[i],
                metadata=meta
            )
            # Convert cosine distance to 0..1 similarity
            dist = distances[i] if i < len(distances) else 0.5
            similarity = max(0.0, min(1.0, 1.0 - (dist / 2.0)))
            output.append((chunk, similarity))
        return output

    def count(self) -> int:
        return self.collection.count()


def get_vector_store(store_type: Optional[str] = None) -> VectorStoreClient:
    """Factory to get the preferred vector store."""
    store_type = store_type or os.getenv("VECTOR_STORE", "chroma").lower()
    if store_type == "chroma":
        try:
            return ChromaVectorStore()
        except Exception as e:
            print(f"[VectorStoreFactory] Chroma init failed ({e}). Falling back to LocalJsonVectorStore.")
    return LocalJsonVectorStore()


# ------------------------------------------------------------------------------
# 5. Ingestion Orchestrator
# ------------------------------------------------------------------------------

def ingest_all(
    data_dir: str = "data/legal_acts",
    embedding_provider: Optional[str] = None,
    vector_store_type: Optional[str] = None,
    force_reindex: bool = False
) -> Dict[str, Any]:
    """
    Scans data_dir for .md and .txt files, chunks them, embeds them,
    and indexes into the active vector store (and local JSON store for redundancy).
    """
    print("================================================================")
    print(f"[ClearCase Ingestion] Starting statutory corpus ingestion from: {data_dir}")
    print("================================================================")

    files = glob.glob(os.path.join(data_dir, "*.md")) + glob.glob(os.path.join(data_dir, "*.txt"))
    if not files:
        raise FileNotFoundError(f"No legal act files found in directory: {data_dir}")

    all_chunks: List[LegalChunk] = []
    for file_path in sorted(files):
        print(f"[ClearCase Ingestion] Reading and chunking: {os.path.basename(file_path)}")
        chunks = chunk_markdown_legal_file(file_path)
        all_chunks.extend(chunks)
        print(f"   -> Generated {len(chunks)} chunk(s).")

    print(f"\n[ClearCase Ingestion] Total statutory chunks across corpus: {len(all_chunks)}")

    # Initialize Embedding Client
    emb_client = get_embedding_client(embedding_provider)
    print(f"[ClearCase Ingestion] Computing embeddings using: {emb_client.__class__.__name__}...")

    # Embed all chunks
    texts = [c.content for c in all_chunks]
    embeddings = emb_client.get_embeddings(texts)
    for i, emb in enumerate(embeddings):
        all_chunks[i].embedding = emb

    # Primary vector store (Chroma or Local)
    store = get_vector_store(vector_store_type)
    store.add_chunks(all_chunks)

    # Always also synchronize local JSON vector store for zero-dependency test/offline assurance
    local_store = LocalJsonVectorStore()
    local_store.add_chunks(all_chunks)

    stats = {
        "status": "SUCCESS",
        "total_files": len(files),
        "total_chunks": len(all_chunks),
        "embedding_client": emb_client.__class__.__name__,
        "vector_store": store.__class__.__name__,
        "local_store_count": local_store.count(),
        "files_indexed": [os.path.basename(f) for f in files]
    }

    print("\n================================================================")
    print("[ClearCase Ingestion] Ingestion Complete!")
    print(f"Indexed Chunks: {stats['total_chunks']}")
    print(f"Embedding Provider: {stats['embedding_client']}")
    print(f"Primary Store: {stats['vector_store']}")
    print("================================================================")

    return stats


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Ingest ClearCase Legal Knowledge Base")
    parser.add_argument("--dir", default="data/legal_acts", help="Directory containing legal statutes")
    parser.add_argument("--provider", default=None, help="Embedding provider: 'bedrock', 'local', 'auto'")
    parser.add_argument("--store", default=None, help="Vector store: 'chroma' or 'local'")
    parser.add_argument("--force", action="store_true", help="Force re-indexing")
    args = parser.parse_args()

    ingest_all(
        data_dir=args.dir,
        embedding_provider=args.provider,
        vector_store_type=args.store,
        force_reindex=args.force
    )
