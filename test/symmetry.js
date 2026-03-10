// 점을 표현하기 위한 간단한 헬퍼
function point(x, y) {
  return { x, y };
}

// 벡터/점 연산 헬퍼
function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function mul(a, k) {
  return { x: a.x * k, y: a.y * k };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

// 좌상단 A, 좌하단 B, 우하단 C 가 주어졌을 때 우상단 D 계산
export function find_symmetry(A, B, C) {
  // 1) 대각선 AC 중점 O
  const O = point((A.x + C.x) / 2, (A.y + C.y) / 2);

  // 2) 왼쪽 변 AB 방향 벡터 v
  const v = sub(B, A); // B - A

  // 3) v 에 수직인 방향 벡터 n (대칭축의 방향)
  const n = point(-v.y, v.x);

  // 4) A 를 O 기준으로 옮긴 벡터 w = A - O
  const w = sub(A, O);

  // 5) w 를 n 에 투영한 계수 t = (w·n) / (n·n)
  const nn = dot(n, n);
  if (nn === 0) {
    throw new Error("A와 B가 같은 점입니다. 유효한 사다리꼴이 아닙니다.");
  }
  const t = dot(w, n) / nn;

  // 6) 투영 벡터 p = t * n
  const p = mul(n, t);

  // 7) 반사된 벡터 w' = 2p - w
  const w_reflected = sub(mul(p, 2), w);

  // 8) 최종 D = O + w'
  const D = add(O, w_reflected);

  return D;
}

// 사용 예시
// const A = point(0, 10);   // 좌상단
// const B = point(0, 0);    // 좌하단
// const C = point(8, 0);    // 우하단

// const D = find_symmetry(A, B, C);
// console.log("Right-top vertex D:", D);


// export default find_symmetry;