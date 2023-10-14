interface TokenReset {
  token: string;
  email: string;
}

export const TIME_BEFORE_EXPIRATION = 15 * 60 * 1000; // 15 minutes
const TOKEN_SIZE = 15;

/**
 * This class is used to store the tokens used to reset the password.
 * It is a singleton.
 */
export default class TokenResetPass {
  /** The singleton instance */
  private static instance: TokenResetPass;
  /** The set of tokens */
  private tokens: Set<TokenReset> = new Set();

  private constructor() {}

  /**
   * Returns the singleton instance
   * @returns The singleton instance
   */
  public static getInstance(): TokenResetPass {
    if (!TokenResetPass.instance)
      TokenResetPass.instance = new TokenResetPass();

    return TokenResetPass.instance;
  }

  /**
   * Generates a random token
   * @returns A random token
   */
  private generateToken(): string {
    let token = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < TOKEN_SIZE; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return token;
  }

  /**
   * Generates a unique token
   * @returns A unique token
   */
  private generateUniqueToken(): string {
    let token = this.generateToken();
    while (this.has(token)) {
      token = this.generateToken();
    }

    return token;
  }

  /**
   * Adds a token to the set
   * @param email email of the user
   * @param token token to add
   */
  private add(email: string, token: string) {
    this.tokens.add({ email, token });
    setTimeout(() => {
      if (this.tokens.has({ email, token }))
        this.tokens.delete({ email, token });
    }, TIME_BEFORE_EXPIRATION);
  }

  public generate(email: string): string {
    const token = this.generateUniqueToken();
    this.add(email, token);

    return token;
  }

  /**
   * Removes a token from the set
   * @param token token to remove
   */
  public remove(token: string) {
    this.tokens.forEach((t) => {
      if (t.token === token) this.tokens.delete(t);
    });
  }

  /**
   * Checks if the set contains a token
   * @param token token to check
   * @returns true if the set contains the token, false otherwise
   */
  public has(token: string): boolean {
    let has = false;
    this.tokens.forEach((t) => {
      if (t.token === token) has = true;
    });

    return has;
  }

  /**
   * Returns the email associated with a token
   * @param token token to check
   * @returns the email associated with the token
   */
  public getEmail(token: string): string {
    let email = "";
    this.tokens.forEach((t) => {
      if (t.token === token) email = t.email;
    });

    return email;
  }
}
