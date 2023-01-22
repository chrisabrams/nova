// TODO: Does this type exist?
export interface DenoConfig {
  importMap?: string;
}

// TODO: Does this type exist?
export interface ImportMap {
  imports: Record<string, string>;
}

export interface NovaAppConfig {
  distDir?: string;
  extensions?: string[];
  mode?: "development";
}
