import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Copy, Download, ExternalLink, Printer, Search, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Certificate } from '../types';

export const CertificatesScreen: React.FC<{ certificateId?: string }> = ({ certificateId }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | undefined>(undefined);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<Certificate | null | undefined>(undefined);

  useEffect(() => {
    const certs = storage.getCertificates(user?.uid);
    setCertificates(certs);

    if (certificateId) {
      const target = storage.getCertificateById(certificateId);
      if (target) setSelectedCert(target);
    } else if (certs.length > 0) {
      setSelectedCert(certs[0]);
    }
  }, [certificateId, user]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    const cert = storage.getCertificateById(verifyInput.trim().toUpperCase());
    setVerifyResult(cert || null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Verified Certificates
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Official skill credentials earned upon 100% course completion.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        
        {/* Verification Lookup Bar */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Verify Certificate Authenticity</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Enter a unique verification identifier (e.g. ERN-184920) to verify issuer record.
          </p>

          <form onSubmit={handleVerify} className="flex gap-2 max-w-lg">
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Enter Verification Code..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-colors shrink-0"
            >
              Verify Record
            </button>
          </form>

          {verifyResult !== undefined && (
            <div className="mt-4 p-4 rounded-2xl text-xs border">
              {verifyResult ? (
                <div className="bg-emerald-50 border-emerald-200 text-emerald-950 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-1 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>OFFICIALLY VERIFIED RECORD</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Issued to <strong>{verifyResult.learnerName}</strong> for completing "{verifyResult.courseTitle}".
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCert(verifyResult)}
                    className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                  >
                    View Record
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50 border-rose-200 text-rose-800 p-3 rounded-xl font-medium">
                  No certificate record matches "{verifyInput}". Check the code and try again.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Issued Certificates List */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* List Sidebar */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Your Issued Certificates ({certificates.length})
              </h3>
              {certificates.map((cert) => {
                const isSelected = selectedCert?.id === cert.id;
                return (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{cert.verificationCode}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {cert.courseTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Issued on {cert.issuedAt}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Certificate Render Frame */}
            {selectedCert && (
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-slate-800 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>

                {/* Printable Official EARNERS Certificate Design */}
                <div id="printable-certificate" className="bg-white p-8 sm:p-12 rounded-3xl border-4 border-slate-900 shadow-2xl relative overflow-hidden text-center text-slate-900">
                  
                  {/* Decorative Border Inset */}
                  <div className="absolute inset-3 border-2 border-amber-500/50 rounded-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    {/* Emblem */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-2xl mx-auto shadow-md">
                      E
                    </div>

                    <div>
                      <div className="text-xs font-extrabold text-amber-600 tracking-widest uppercase">
                        EARNERS SKILL LEARNING PLATFORM
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                        CERTIFICATE OF COMPLETION
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">This official document certifies that</p>
                    </div>

                    <div className="py-2 border-b-2 border-slate-900 max-w-md mx-auto">
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                        {selectedCert.learnerName}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                      has successfully completed 100% of curriculum coursework and verified assessment requirements for
                    </p>

                    <div className="text-lg sm:text-xl font-black text-amber-700 font-sans px-4">
                      "{selectedCert.courseTitle}"
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 max-w-xl mx-auto text-xs text-slate-600 border-t border-slate-200">
                      <div className="text-center sm:text-left">
                        <div className="font-bold text-slate-900">{selectedCert.instructorName}</div>
                        <div className="text-[10px] text-slate-400">Lead Faculty Instructor</div>
                      </div>

                      <div className="text-center sm:text-right">
                        <div className="font-mono font-bold text-slate-900">{selectedCert.verificationCode}</div>
                        <div className="text-[10px] text-slate-400">Issued: {selectedCert.issuedAt}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-900">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500">
              Complete 100% of the lessons in any course to automatically issue your verified skill certificate!
            </p>
            <button
              onClick={() => navigate({ page: 'explore' })}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
            >
              Start Learning
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
