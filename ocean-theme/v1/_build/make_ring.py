"""Generate media/ring.glb: a solitaire ring (gold band + faceted stone + prongs) as glTF 2.0 binary.
Run: python3 ocean-theme/v1/_build/make_ring.py  (needs numpy). Units are metres (a ~20 mm ring)."""
import json, os, struct
import numpy as np

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'media', 'ring.glb')


def torus(R, r, nu=96, nv=32):
    u = np.linspace(0, 2 * np.pi, nu, endpoint=False)
    v = np.linspace(0, 2 * np.pi, nv, endpoint=False)
    uu, vv = np.meshgrid(u, v, indexing='ij')
    # band lies in the XY plane (ring stands upright), slightly flattened profile
    x = (R + r * np.cos(vv)) * np.cos(uu)
    y = (R + r * np.cos(vv)) * np.sin(uu)
    z = 1.6 * r * np.sin(vv)
    nx = np.cos(vv) * np.cos(uu); ny = np.cos(vv) * np.sin(uu); nz = np.sin(vv) / 1.6
    pos = np.stack([x, y, z], -1).reshape(-1, 3)
    nrm = np.stack([nx, ny, nz], -1).reshape(-1, 3)
    nrm /= np.linalg.norm(nrm, axis=1, keepdims=True)
    idx = []
    for i in range(nu):
        for j in range(nv):
            a = i * nv + j; b = ((i + 1) % nu) * nv + j; c = ((i + 1) % nu) * nv + (j + 1) % nv; d = i * nv + (j + 1) % nv
            idx += [a, b, c, a, c, d]
    return pos, nrm, np.array(idx)


def stone(cy, rad, h_crown, h_pav, n=16):
    """Brilliant-ish stone: table, crown ring, girdle, pavilion point. Flat-shaded (unshared verts)."""
    ang = np.linspace(0, 2 * np.pi, n, endpoint=False)
    table = [(0.55 * rad * np.cos(a), cy + h_crown, 0.55 * rad * np.sin(a)) for a in ang]
    girdle = [(rad * np.cos(a), cy, rad * np.sin(a)) for a in ang]
    top = (0, cy + h_crown, 0); cul = (0, cy - h_pav, 0)
    tris = []
    for i in range(n):
        j = (i + 1) % n
        tris += [(top, table[j], table[i]), (table[i], table[j], girdle[j]), (table[i], girdle[j], girdle[i]), (girdle[i], girdle[j], cul)]
    pos, nrm = [], []
    for t in tris:
        p = np.array(t, dtype=float); n_ = np.cross(p[1] - p[0], p[2] - p[0])
        if np.dot(n_, p.mean(0) - np.array([0, cy, 0])) < 0:
            p = p[[0, 2, 1]]; n_ = -n_
        n_ /= np.linalg.norm(n_) or 1
        pos += list(p); nrm += [n_] * 3
    pos = np.array(pos); return pos, np.array(nrm), np.arange(len(pos))


def prong(x, z, y0, y1, r=0.00045, n=10):
    a = np.linspace(0, 2 * np.pi, n, endpoint=False)
    pos, nrm, idx = [], [], []
    for k, y in enumerate((y0, y1)):
        for t in a:
            pos.append((x + r * np.cos(t), y, z + r * np.sin(t))); nrm.append((np.cos(t), 0, np.sin(t)))
    for i in range(n):
        j = (i + 1) % n
        idx += [i, j, n + j, i, n + j, n + i]
    return np.array(pos), np.array(nrm), np.array(idx)


R, r = 0.0092, 0.0011
band = torus(R, r)
top_y = R + r
st = stone(top_y + 0.0024, 0.0032, 0.0012, 0.0026)
prongs = [prong(0.0026 * np.cos(t), 0.0026 * np.sin(t), top_y - 0.0004, top_y + 0.0034) for t in np.linspace(0, 2 * np.pi, 4, endpoint=False) + np.pi / 4]
gold_parts = [band] + prongs
gp = np.concatenate([p for p, _, _ in gold_parts]); gn = np.concatenate([n for _, n, _ in gold_parts])
gi, off = [], 0
for p, _, i in gold_parts:
    gi.append(i + off); off += len(p)
gi = np.concatenate(gi)

bufs, views, accessors = b'', [], []


def add(arr, comp, typ, target):
    global bufs
    data = arr.astype(np.float32 if comp == 5126 else np.uint32).tobytes()
    while len(bufs) % 4: bufs += b'\0'
    views.append({'buffer': 0, 'byteOffset': len(bufs), 'byteLength': len(data), 'target': target})
    bufs += data
    acc = {'bufferView': len(views) - 1, 'componentType': comp, 'count': len(arr), 'type': typ}
    if typ == 'VEC3':
        acc['min'] = arr.min(0).tolist(); acc['max'] = arr.max(0).tolist()
    accessors.append(acc); return len(accessors) - 1


meshes = []
for (p, n, i), mat in ((( gp, gn, gi)), 0), ((st), 1):
    pa = add(p, 5126, 'VEC3', 34962); na = add(n, 5126, 'VEC3', 34962); ia = add(i, 5125, 'SCALAR', 34963)
    meshes.append({'primitives': [{'attributes': {'POSITION': pa, 'NORMAL': na}, 'indices': ia, 'material': mat}]})

gltf = {
    'asset': {'version': '2.0', 'generator': 'Ocean theme prototype'},
    'scene': 0, 'scenes': [{'nodes': [0, 1]}],
    'nodes': [{'mesh': 0, 'name': 'Band'}, {'mesh': 1, 'name': 'Stone'}],
    'meshes': meshes,
    'materials': [
        {'name': '14k yellow gold', 'pbrMetallicRoughness': {'baseColorFactor': [1.0, 0.78, 0.42, 1], 'metallicFactor': 1.0, 'roughnessFactor': 0.18}},
        {'name': 'Lab-grown diamond', 'pbrMetallicRoughness': {'baseColorFactor': [0.96, 0.98, 1.0, 1], 'metallicFactor': 0.1, 'roughnessFactor': 0.02}},
    ],
    'buffers': [{'byteLength': len(bufs)}], 'bufferViews': views, 'accessors': accessors,
}
js = json.dumps(gltf, separators=(',', ':')).encode()
while len(js) % 4: js += b' '
while len(bufs) % 4: bufs += b'\0'
glb = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(bufs)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(bufs), 0x004E4942) + bufs
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'wb').write(glb)
print('wrote', OUT, len(glb), 'bytes')
