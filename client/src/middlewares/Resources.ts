export default class Resources {
  private types: string[] = [];
  private genres: string[] = [];
  private countries: string[] = [];
  private languages: string[] = [];

  private static instance: Resources;

  public static getInstance(): Resources {
    if (!Resources.instance) {
      Resources.instance = new Resources();
    }
    return Resources.instance;
  }

  public static getInstanceSync(): Resources {
    const instance = Resources.instance;
    if (!instance || !instance.isReady()) {
      throw new Error("Resources not ready");
    }

    return instance;
  }

  private constructor() {}

  public isReady(): boolean {
    return (
      this.types.length > 0 &&
      this.genres.length > 0 &&
      this.countries.length > 0 &&
      this.languages.length > 0
    );
  }

  public getTypes(): string[] {
    return this.types;
  }

  public getGenres(): string[] {
    return this.genres;
  }

  public getCountries(): string[] {
    return this.countries;
  }

  public getLanguages(): string[] {
    return this.languages;
  }

  public async fill(): Promise<void> {
    await this.fillTypes();
    await this.fillGenres();
    await this.fillCountries();
    await this.fillLanguages();
  }

  private async fillTypes(): Promise<void> {
    const res = await fetch(process.env.REACT_APP_API_URL + "/v1/types", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      this.types = data.types;
    }
  }

  private async fillGenres(): Promise<void> {
    const res = await fetch(process.env.REACT_APP_API_URL + "/v1/genres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      this.genres = data.genres;
    }
  }

  private async fillCountries(): Promise<void> {
    const res = await fetch(process.env.REACT_APP_API_URL + "/v1/countries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      this.countries = data.countries;
    }
  }

  private async fillLanguages(): Promise<void> {
    const res = await fetch(process.env.REACT_APP_API_URL + "/v1/languages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      this.languages = data.languages;
    }
  }
}
