export interface INavItem {
  title: string;
  icon?: string;
  children?: INavItem[];
  path?: string;
}