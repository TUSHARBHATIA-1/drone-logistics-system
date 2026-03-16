import React from 'react';
import { User, Building, MapPin, Mail, Phone, Shield, CreditCard, Bell } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl text-white font-bold">Company Profile</h2>
        <p className="text-dark-400 mt-1">Manage your corporate credentials and fleet settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-800 mx-auto flex items-center justify-center border-4 border-dark-900 shadow-xl mb-4">
              <Building className="text-white w-10 h-10" />
            </div>
            <h3 className="text-xl text-white">Global Logistics</h3>
            <p className="text-xs text-dark-500 uppercase tracking-widest mt-1">Established 2024</p>
            <button className="mt-6 w-full btn-secondary py-2 text-sm">Upload Logo</button>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h4 className="text-xs font-bold text-dark-500 uppercase tracking-widest">Verification Status</h4>
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <Shield className="text-green-400 w-5 h-5" />
              <span className="text-xs text-green-400 font-bold uppercase">KYC Verified</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-lg text-white mb-6 border-b border-dark-800 pb-4">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-dark-500 uppercase">Administrator</label>
                 <div className="flex items-center gap-3 px-4 py-3 bg-dark-950 border border-dark-800 rounded-xl text-dark-100">
                   <User className="w-4 h-4 text-dark-400" /> Alex Rivera
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-dark-500 uppercase">Email Address</label>
                 <div className="flex items-center gap-3 px-4 py-3 bg-dark-950 border border-dark-800 rounded-xl text-dark-100">
                   <Mail className="w-4 h-4 text-dark-400" /> a.rivera@global.io
                 </div>
               </div>
               <div className="sm:col-span-2 space-y-1">
                 <label className="text-[10px] font-bold text-dark-500 uppercase">Headquarters</label>
                 <div className="flex items-center gap-3 px-4 py-3 bg-dark-950 border border-dark-800 rounded-xl text-dark-100">
                   <MapPin className="w-4 h-4 text-dark-400" /> 102nd Tech Hub, Silicon Valley, CA
                 </div>
               </div>
            </div>
            <button className="btn-primary mt-8 px-8">Save Changes</button>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-lg text-white mb-6 border-b border-dark-800 pb-4">Security & Billing</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800 group hover:border-primary-500/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-dark-900 rounded-lg"><CreditCard className="w-5 h-5 text-dark-400" /></div>
                  <div>
                    <p className="text-sm text-white font-medium">Payment Method</p>
                    <p className="text-xs text-dark-500">Visa ending in 4242</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-primary-500 transition-colors" />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800 group hover:border-primary-500/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-dark-900 rounded-lg"><Bell className="w-5 h-5 text-dark-400" /></div>
                  <div>
                    <p className="text-sm text-white font-medium">Notification Preferences</p>
                    <p className="text-xs text-dark-500">Email & Push alerts enabled</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-primary-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-7-7l7 7-7 7"/>
    </svg>
);

export default Profile;
