import { Card } from "@/components/ui/card";
import { sendWhatsappMessage } from "@/utility/common-function";
import { formatDateDifferenceToNow, formatUserDateTime } from "@/utility/date-time-fn";

import { getLabelFromValue, userStatusList } from "@/lib/constants/common";
import {
    AtSign,
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Fingerprint,
    Hash,
    Key,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    UserCheck,
    UserCircle,
    User as UserIcon
} from "lucide-react";
import { InfoItem } from "./info-item";

interface GeneralTabProps {
    user: any;
}

export default function GeneralTab({ user }: GeneralTabProps) {
    const provider = user.accounts?.[0]?.providerId || "Credentials";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Basic Information */}
            <Card className="p-8 rounded-[2rem] border-border/40 bg-card/45 backdrop-blur-md shadow-lg overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/30" />
                <h3 className="text-sm font-black text-foreground/80 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <UserIcon size={16} className="text-primary" />
                    Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InfoItem icon={<Hash size={18} />} label="User ID" value={user.id} />
                    <InfoItem icon={<UserIcon size={18} />} label="Name" value={user.name} />
                    <InfoItem icon={<Mail size={18} />} label="Email Address" value={
                        user.email ? (
                            <a href={`mailto:${user.email}`} className="text-primary hover:underline font-bold transition-all duration-300">
                                {user.email}
                            </a>
                        ) : (
                            "Not Provided"
                        )
                    } />
                    <InfoItem icon={<Phone size={18} />} label="Contact Number" value={
                        user.contactNo ? (
                            <a href={`tel:${user.contactNo}`} className="text-primary hover:underline font-bold transition-all duration-300">
                                {user.contactNo}
                            </a>
                        ) : (
                            "Not Provided"
                        )
                    } />
                </div>

                {user.description && (
                    <div className="mt-10 pt-8 border-t border-border/40">
                        <div className="group flex items-start gap-4">
                            <div className="mt-1 p-2.5 rounded-2xl bg-muted/50 text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 shadow-sm border border-border/20">
                                <FileText size={18} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Bio / Long Description</p>
                                <p className="text-sm text-foreground/85 leading-relaxed bg-muted/20 p-5 rounded-2xl border border-border/30">
                                    {user.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Account & Category */}
            <Card className="p-8 rounded-[2rem] border-border/40 bg-card/45 backdrop-blur-md shadow-lg overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:border-indigo-500/20">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/30" />
                <h3 className="text-sm font-black text-foreground/80 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Key size={16} className="text-indigo-500" />
                    Account & Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <InfoItem icon={<AtSign size={18} />} label="User Name" value={user.username || "N/A"} />
                    <InfoItem icon={<Fingerprint size={18} />} label="Provider Type" value={provider} />
                    <InfoItem icon={<CheckCircle2 size={18} />} label="Account Verified" value={user.emailVerified ? "Yes" : "No"} />
                    <InfoItem icon={<UserCheck size={18} />} label="User Status" value={getLabelFromValue(user.status, userStatusList)} highlight />
                </div>
            </Card>

            {/* Additional Information */}
            {user.occupation || user.address && (
                <Card className="p-8 rounded-[2rem] border-border/40 bg-card/45 backdrop-blur-md shadow-lg overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:border-amber-500/20">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/30" />
                    <h3 className="text-sm font-black text-foreground/80 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <Briefcase size={16} className="text-amber-500" />
                        Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <InfoItem icon={<Briefcase size={18} />} label="Occupation" value={user.occupation || "Unknown"} />
                        <InfoItem icon={<MapPin size={18} />} label="Address" value={user.address || "Unknown"} />
                    </div>
                </Card>
            )}

            {/* Metadata */}
            <Card className="p-8 rounded-[2rem] border-border/40 bg-card/45 backdrop-blur-md shadow-lg overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:border-emerald-500/20">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/30" />
                <h3 className="text-sm font-black text-foreground/80 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Clock size={16} className="text-emerald-500" />
                    Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                    <InfoItem icon={<Calendar size={18} />} label="Created" value={formatDateDifferenceToNow(user.createdAt)} />
                    <InfoItem icon={<UserCircle size={18} />} label="Created By" value="System" />
                    <InfoItem icon={<Calendar size={18} />} label="Created At" value={formatUserDateTime(user.createdAt)} />
                    <InfoItem icon={<UserCircle size={18} />} label="Updated By" value="System" />
                    <InfoItem icon={<Calendar size={18} />} label="Updated At" value={formatUserDateTime(user.updatedAt)} />
                </div>
            </Card>

            {/* Social Media Details */}
            {user.contactNo && (
                <Card className="p-8 rounded-[2rem] border-border/40 bg-card/45 backdrop-blur-md shadow-lg overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:border-emerald-500/20">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/30" />
                    <h3 className="text-sm font-black text-foreground/80 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <MessageCircle size={16} className="text-emerald-500" />
                        Social Media Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <InfoItem
                            icon={<MessageCircle size={18} />}
                            label="WhatsApp"
                            value={
                                <a
                                    href={sendWhatsappMessage(user.contactNo, `Hello, ${user.name}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-500 hover:underline inline-flex items-center gap-1.5 font-black"
                                >
                                    Message
                                </a>
                            }
                        />
                    </div>
                </Card>
            )}
        </div>
    );
}
