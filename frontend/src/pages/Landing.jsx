import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Plane, 
  Package, 
  Clock, 
  Star,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { motion } from 'framer-motion';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-primary-500/30 overflow-x-hidden">
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="h-24 border-b border-dark-900/50 flex items-center justify-between px-6 md:px-16 sticky top-0 bg-dark-950/60 backdrop-blur-2xl z-50"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-primary-600 p-2.5 rounded-2xl shadow-xl shadow-primary-900/20"
          >
            <Package className="text-white w-7 h-7" />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight">
            SkyLogist <span className="text-primary-500">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/login" className="text-[10px] md:text-sm font-black uppercase tracking-widest text-dark-400 hover:text-white transition-colors">Login</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="btn-primary py-3 md:py-4 px-6 md:px-8 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-600/10">Get Started</Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 md:px-16 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary-600/10 blur-[150px] rounded-full -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-dark-900/50 backdrop-blur-md border border-dark-800 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12"
        >
          <Zap className="w-4 h-4" />
          <span>v2.0 Autonomous Dispatch System is Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-4xl md:text-8xl font-black mb-8 leading-[1.1] max-w-5xl tracking-tight"
        >
          Drone Logistics & <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-700">Route Optimization</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-2xl text-dark-400 max-w-3xl mb-12 md:mb-16 font-medium leading-relaxed px-4"
        >
          Smart, Fast, and Autonomous. Revolutionizing the last-mile logistics with AI-driven orbital route planning and reactive drone fleet management.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto"
        >
          <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link to="/register" className="btn-primary py-5 md:py-6 px-10 md:px-12 rounded-[24px] text-base md:text-lg font-black flex items-center justify-center gap-4 group shadow-[0_20px_50px_rgba(59,130,246,0.15)]">
              Start Deploying Fleet <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
          <Link to="/login" className="w-full sm:w-auto px-10 py-5 text-dark-300 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-4 group transition-all">
            <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-500 group-hover:scale-110 transition-transform" /> Watch Demo
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="mt-24 w-full max-w-6xl rounded-[40px] border border-dark-800 bg-dark-900/40 p-5 shadow-3xl relative group"
        >
           <div className="absolute inset-0 bg-primary-600/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <div className="rounded-[32px] overflow-hidden aspect-video relative group border border-dark-800 bg-dark-950">
              <div className="absolute inset-0 flex items-center justify-center bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer backdrop-blur-sm">
                 <motion.div 
                   whileHover={{ scale: 1.1 }}
                   className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl"
                 >
                    <PlayCircle className="w-12 h-12 text-primary-600 ml-1.5" />
                 </motion.div>
              </div>
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 10 }}
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1600" 
                alt="Drone Fleet Management" 
                className="w-full h-full object-cover opacity-60 transition-transform duration-700"
              />
              <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex items-center justify-between z-20">
                 <div className="flex items-center gap-3 md:gap-4 bg-dark-950/80 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-dark-800">
                    <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white">Live Telemetry Active</span>
                 </div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-8 md:px-16 bg-dark-900/20 relative">
        <div className="absolute inset-0 bg-primary-950/5 pointer-events-none"></div>
        <motion.div 
          {...fadeInUp}
          className="text-center mb-16 md:mb-24 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">Enterprise Performance</h2>
          <p className="text-dark-500 font-medium text-base md:text-lg max-w-2xl mx-auto px-4">Engineered for absolute reliability, sub-hour fulfillment, and tactical safety at planetary scale.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {[
            { icon: Zap, title: 'Rapid Deployment', desc: 'Sub-hour fulfillment cycles powered by ultrasonic drone acceleration and automated sorting hubs.' },
            { icon: Globe, title: 'Smart Pathfinding', desc: 'Dynamic navigation avoids traffic, no-fly zones, and adverse weather with machine learning logic.' },
            { icon: Shield, title: 'Tactical Tracking', desc: 'Monitor every vibration, battery cycle, and coordinate via our high-frequency landing control.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -10, borderColor: 'rgba(59, 130, 246, 0.4)' }}
              className="premium-card p-8 md:p-12 group"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 border border-primary-500/20 group-hover:bg-primary-600 transition-all duration-500 shadow-lg shadow-primary-900/5">
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-primary-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-sm md:text-dark-400 leading-relaxed font-semibold italic opacity-80 group-hover:opacity-100 transition-opacity">"{feature.desc}"</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-40 px-6 md:px-16 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-24 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8 md:space-y-10"
          >
            <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight uppercase text-center lg:text-left">Scale Operations <br className="hidden md:block"/> <span className="text-primary-500 italic">In Seconds.</span></h2>
            <p className="text-dark-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 text-center lg:text-left px-4 md:px-0">Our simplified onboarding protocol allows logistics giants to transition to autonomous delivery without the traditional infrastructure overhead.</p>
            
            <div className="space-y-8 pt-6">
              {[
                { n: '01', t: 'Register Auth-Hub', d: 'Onboard your company in our secure cryptographic registry.' },
                { n: '02', t: 'Initialize Fleet Signature', d: 'Add or rent industrial-grade drones from our orbital marketplace.' },
                { n: '03', t: 'Dispatch & Vector', d: 'Deploy missions and track deliveries with real-time AI pathfinding.' }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-8 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-dark-800 flex items-center justify-center flex-shrink-0 text-primary-500 font-mono text-xl font-black shadow-xl group-hover:border-primary-500/50 transition-all">
                    {step.n}
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-primary-400 transition-colors">{step.t}</h4>
                    <p className="text-dark-500 font-medium leading-relaxed">{step.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="flex-1 relative"
          >
            <div className="relative p-6 md:p-12 premium-card bg-dark-900/20 border-dark-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 shadow-3xl">
               <div className="p-6 md:p-8 bg-dark-950 border border-dark-800 rounded-3xl flex flex-col gap-4 group hover:border-green-500/30 transition-all">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500"><CheckCircle className="w-7 h-7"/></div>
                  <div>
                    <span className="text-[10px] text-dark-500 font-black uppercase tracking-[0.3em] block mb-1">Hub Status</span>
                    <span className="text-xl font-black text-white">ONLINE</span>
                  </div>
               </div>
               <div className="p-8 bg-dark-950 border border-dark-800 rounded-3xl flex flex-col gap-4 group hover:border-primary-500/30 transition-all">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500"><Plane className="w-7 h-7"/></div>
                  <div>
                    <span className="text-[10px] text-dark-500 font-black uppercase tracking-[0.3em] block mb-1">Active Hulls</span>
                    <span className="text-xl font-black text-white">42 UNITS</span>
                  </div>
               </div>
               <div className="p-8 md:p-10 bg-dark-950/60 sm:col-span-2 rounded-[32px] border border-dark-800 flex flex-col items-center justify-center gap-6">
                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-dark-500">
                      <span>Global Sync Rate</span>
                      <span className="text-primary-400">84%</span>
                    </div>
                    <div className="h-3 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-dark-800">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: '84%' }}
                         transition={{ duration: 2, delay: 0.5 }}
                         className="h-full bg-primary-600 rounded-full shadow-lg shadow-primary-500/20"
                       ></motion.div>
                    </div>
                  </div>
                  <span className="text-[9px] text-dark-600 font-black uppercase tracking-[0.4em] animate-pulse">Establishing Sector Connection...</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24 md:py-40 px-6 md:px-16 bg-dark-900/30 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="flex justify-center gap-2 mb-10 text-primary-500"
          >
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-5xl font-black italic text-white leading-[1.4] mb-8 md:mb-12 tracking-tight px-4"
          >
            "Switching to SkyLogist AI reduced our operational costs by 64% within the first quarter. The autonomous routing logic is simply unrivaled."
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center font-black text-2xl shadow-2xl shadow-primary-600/30">MS</div>
            <div className="text-left">
              <p className="font-black text-white uppercase tracking-[0.2em] text-sm">Marcus Sterling</p>
              <p className="text-xs text-dark-500 font-black uppercase tracking-widest mt-1">Director of Ops, NeoFreight Systems</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-6 md:px-16 relative">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative premium-card bg-primary-600/95 p-10 md:p-32 text-center space-y-10 md:space-y-12 overflow-hidden rounded-[40px] md:rounded-[60px] shadow-3xl shadow-primary-900/50 border-white/10"
         >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full animate-float"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-3s' }}></div>
            
            <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tight leading-none mb-6">Initialize Your <br className="hidden md:block"/> Mission Hub.</h2>
            <p className="text-primary-100 text-lg md:text-2xl max-w-3xl mx-auto font-medium opacity-90 leading-relaxed px-4">
              Join 500+ logistics giants already leveraging autonomous flight signatures today.
            </p>
            
            <div className="pt-8">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="bg-white text-primary-600 hover:bg-dark-50 transition-all py-5 md:py-6 px-10 md:px-16 rounded-[24px] text-lg md:text-xl font-black shadow-2xl inline-flex items-center gap-4 group">
                  Initialize Protocol <ArrowRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-3 transition-transform" />
                </Link>
              </motion.div>
            </div>
         </motion.div>
      </section>
    </div>
  );
};

export default Landing;
