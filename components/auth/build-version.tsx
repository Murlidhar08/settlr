import { getAppVersion } from "@/actions/user-settings.actions";

export async function BuildVersion() {
    const version = await getAppVersion();

    return (
        <div className="fixed bottom-4 right-4 z-50 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                Build Version {version}
            </p>
        </div>
    );
}
