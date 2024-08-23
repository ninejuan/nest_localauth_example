export class User {
  id: string;
  password?: string;
  nickname?: string;
  description?: string;
  associated?: string;
  mailaddr?: string;
  profilePhoto?: string;
  rank?: string;
  solved_problems?: Array<Number>;
  wrong_problems?: Array<Number>;
  my_problems?: Array<Number>;
  contributed_problems?: Array<Number>;
  refreshToken?: string; // 사용자에게 할당된 Refresh Token
}
