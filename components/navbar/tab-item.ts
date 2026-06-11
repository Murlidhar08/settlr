export type TabItem = {
    id: string;
    label: string;
    href?: string;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    badgeCount?: number;
    active?: boolean;
    hidden?: boolean;
};