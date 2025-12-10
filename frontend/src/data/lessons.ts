export interface Lesson {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string[];
  example: string;
  points?: string[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    category: "기초",
    title: "TypeScript 소개",
    description: "TypeScript는 JavaScript에 타입을 추가한 프로그래밍 언어입니다.",
    content: [
      "TypeScript는 Microsoft에서 개발한 오픈소스 프로그래밍 언어로, JavaScript의 상위 집합(superset)입니다.",
      "정적 타입 검사를 통해 개발 중에 오류를 미리 발견할 수 있습니다.",
      "모든 JavaScript 코드는 유효한 TypeScript 코드입니다."
    ],
    points: [
      "타입 안정성 제공",
      "IDE 자동완성 및 인텔리센스 지원",
      "리팩토링이 쉽고 안전함",
      "최신 JavaScript 기능 사용 가능"
    ],
    example: `// TypeScript 기본 예제
let message: string = "안녕하세요, TypeScript!";
let count: number = 42;
let isActive: boolean = true;

console.log(message);
console.log("카운트:", count);
console.log("활성화:", isActive);`
  },
  {
    id: 2,
    category: "기초",
    title: "기본 타입",
    description: "TypeScript의 기본 타입들을 학습합니다.",
    content: [
      "TypeScript는 다양한 기본 타입을 제공합니다.",
      "타입 선언을 통해 변수가 어떤 값을 가질 수 있는지 명시할 수 있습니다."
    ],
    points: [
      "string: 문자열",
      "number: 숫자 (정수, 실수 모두)",
      "boolean: 참/거짓",
      "any: 모든 타입 허용",
      "void: 반환값이 없음",
      "null, undefined: 각각의 타입"
    ],
    example: `// 기본 타입 예제
let userName: string = "김철수";
let age: number = 25;
let isStudent: boolean = true;
let score: number = 95.5;

// 배열
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

console.log(\`이름: \${userName}, 나이: \${age}\`);
console.log("학생 여부:", isStudent);
console.log("숫자 배열:", numbers);`
  },
  {
    id: 3,
    category: "기초",
    title: "인터페이스",
    description: "객체의 구조를 정의하는 인터페이스를 학습합니다.",
    content: [
      "인터페이스는 객체의 타입을 정의하는 TypeScript의 핵심 기능입니다.",
      "객체가 가져야 할 프로퍼티와 메서드를 명시할 수 있습니다.",
      "코드의 가독성과 유지보수성을 높여줍니다."
    ],
    example: `// 인터페이스 예제
interface User {
  name: string;
  age: number;
  email: string;
  isActive?: boolean; // 선택적 프로퍼티
}

const user1: User = {
  name: "박민수",
  age: 30,
  email: "minsu@example.com",
  isActive: true
};

const user2: User = {
  name: "이영희",
  age: 28,
  email: "younghee@example.com"
};

console.log("사용자 1:", user1);
console.log("사용자 2:", user2);`
  },
  {
    id: 4,
    category: "중급",
    title: "함수와 타입",
    description: "TypeScript에서 함수를 타입 안전하게 사용하는 방법을 학습합니다.",
    content: [
      "함수의 매개변수와 반환값에 타입을 지정할 수 있습니다.",
      "선택적 매개변수와 기본 매개변수를 사용할 수 있습니다.",
      "화살표 함수에도 동일하게 타입을 적용할 수 있습니다."
    ],
    example: `// 함수 타입 예제
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string, greeting: string = "안녕하세요"): string {
  return \`\${greeting}, \${name}님!\`;
}

// 화살표 함수
const multiply = (x: number, y: number): number => {
  return x * y;
};

console.log("덧셈:", add(10, 20));
console.log("인사:", greet("철수"));
console.log("곱셈:", multiply(5, 6));`
  },
  {
    id: 5,
    category: "중급",
    title: "클래스",
    description: "TypeScript의 클래스와 객체지향 프로그래밍을 학습합니다.",
    content: [
      "클래스는 객체를 생성하기 위한 템플릿입니다.",
      "접근 제어자(public, private, protected)를 사용할 수 있습니다.",
      "생성자, 메서드, 프로퍼티를 정의할 수 있습니다."
    ],
    example: `// 클래스 예제
class Person {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): string {
    return \`안녕하세요, 저는 \${this.name}이고 \${this.age}살입니다.\`;
  }

  getAge(): number {
    return this.age;
  }
}

const person = new Person("김민지", 25);
console.log(person.introduce());
console.log("나이:", person.getAge());`
  },
  {
    id: 6,
    category: "중급",
    title: "제네릭",
    description: "재사용 가능한 컴포넌트를 만들기 위한 제네릭을 학습합니다.",
    content: [
      "제네릭은 타입을 매개변수화하여 재사용성을 높입니다.",
      "함수, 클래스, 인터페이스에 모두 사용할 수 있습니다.",
      "타입 안정성을 유지하면서 유연한 코드를 작성할 수 있습니다."
    ],
    example: `// 제네릭 예제
function identity<T>(value: T): T {
  return value;
}

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 사용 예제
const num = identity<number>(42);
const str = identity<string>("Hello");

const numbers = [1, 2, 3, 4, 5];
const strings = ["a", "b", "c"];

console.log("숫자:", num);
console.log("문자열:", str);
console.log("첫 번째 숫자:", getFirstElement(numbers));
console.log("첫 번째 문자:", getFirstElement(strings));`
  },
  {
    id: 7,
    category: "고급",
    title: "유니온과 인터섹션",
    description: "여러 타입을 결합하는 방법을 학습합니다.",
    content: [
      "유니온 타입(|)은 여러 타입 중 하나가 될 수 있음을 나타냅니다.",
      "인터섹션 타입(&)은 여러 타입을 모두 만족해야 함을 나타냅니다.",
      "타입 가드를 사용하여 런타임에 타입을 체크할 수 있습니다."
    ],
    example: `// 유니온과 인터섹션 예제
type Status = "success" | "error" | "loading";

function printStatus(status: Status): string {
  switch(status) {
    case "success":
      return "✓ 성공";
    case "error":
      return "✗ 에러";
    case "loading":
      return "⟳ 로딩 중...";
  }
}

// 인터섹션
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type Staff = Person & Employee;

const staff: Staff = {
  name: "홍길동",
  age: 32,
  employeeId: "E12345",
  department: "개발팀"
};

console.log(printStatus("success"));
console.log(printStatus("loading"));
console.log("직원 정보:", staff);`
  },
  {
    id: 8,
    category: "고급",
    title: "타입 가드",
    description: "런타임에 타입을 안전하게 확인하는 방법을 학습합니다.",
    content: [
      "타입 가드는 조건문을 통해 타입을 좁혀나가는 기법입니다.",
      "typeof, instanceof 연산자를 사용할 수 있습니다.",
      "사용자 정의 타입 가드 함수를 만들 수 있습니다."
    ],
    example: `// 타입 가드 예제
function processValue(value: string | number): string {
  if (typeof value === "string") {
    return \`문자열 길이: \${value.length}\`;
  } else {
    return \`숫자 두 배: \${value * 2}\`;
  }
}

interface Cat {
  meow(): string;
}

interface Dog {
  bark(): string;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

const cat: Cat = {
  meow: () => "야옹!"
};

const dog: Dog = {
  bark: () => "멍멍!"
};

console.log(processValue("Hello"));
console.log(processValue(42));
console.log("고양이인가?", isCat(cat));
console.log("고양이인가?", isCat(dog));`
  },
  {
    id: 9,
    category: "고급",
    title: "유틸리티 타입",
    description: "TypeScript가 제공하는 유용한 유틸리티 타입들을 학습합니다.",
    content: [
      "Partial<T>: 모든 프로퍼티를 선택적으로 만듭니다.",
      "Required<T>: 모든 프로퍼티를 필수로 만듭니다.",
      "Readonly<T>: 모든 프로퍼티를 읽기 전용으로 만듭니다.",
      "Pick<T, K>: 특정 프로퍼티만 선택합니다.",
      "Omit<T, K>: 특정 프로퍼티를 제외합니다."
    ],
    example: `// 유틸리티 타입 예제
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - 모든 프로퍼티가 선택적
type PartialUser = Partial<User>;

const updateUser: PartialUser = {
  name: "김철수"
};

// Pick - 특정 프로퍼티만 선택
type UserPreview = Pick<User, "id" | "name">;

const preview: UserPreview = {
  id: 1,
  name: "이영희"
};

// Omit - 특정 프로퍼티 제외
type UserWithoutEmail = Omit<User, "email">;

const user: UserWithoutEmail = {
  id: 2,
  name: "박민수",
  age: 28
};

console.log("부분 업데이트:", updateUser);
console.log("미리보기:", preview);
console.log("이메일 제외:", user);`
  },
  {
    id: 10,
    category: "실전",
    title: "비동기 프로그래밍",
    description: "TypeScript에서 Promise와 async/await를 사용하는 방법을 학습합니다.",
    content: [
      "Promise는 비동기 작업의 결과를 나타내는 객체입니다.",
      "async/await는 비동기 코드를 동기 코드처럼 작성할 수 있게 해줍니다.",
      "타입을 통해 비동기 작업의 결과를 안전하게 다룰 수 있습니다."
    ],
    example: `// 비동기 프로그래밍 예제
async function fetchUserData(userId: number): Promise<{name: string, email: string}> {
  // 실제로는 API 호출
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "사용자" + userId,
        email: \`user\${userId}@example.com\`
      });
    }, 1000);
  });
}

async function main() {
  console.log("사용자 데이터 가져오는 중...");
  
  try {
    const user = await fetchUserData(123);
    console.log("사용자:", user);
    console.log("이름:", user.name);
    console.log("이메일:", user.email);
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

main();`
  }
];
