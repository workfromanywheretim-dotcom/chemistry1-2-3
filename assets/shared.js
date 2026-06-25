(function(){
  'use strict';

  function initHeader(){
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('navToggle');
    if(!header || !toggle) return;

    window.addEventListener('scroll', function(){
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    });

    toggle.addEventListener('click', function(){
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-mobile a').forEach(function(link){
      link.addEventListener('click', function(){
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', function(){
      if (window.innerWidth > 820){
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initReveal(){
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.reveal');
    if (!prefersReduced && 'IntersectionObserver' in window){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      items.forEach(function(el){ observer.observe(el); });
    } else {
      items.forEach(function(el){ el.classList.add('is-visible'); });
    }
  }

  function initFlipCards(){
    document.querySelectorAll('.flip-card').forEach(function(card){
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      function toggle(){ card.classList.toggle('is-flipped'); }
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
      });
    });
  }

  function initHotspots(){
    document.querySelectorAll('.hotspot-wrap').forEach(function(wrap){
      var note = wrap.querySelector('.hotspot-note');
      var spots = wrap.querySelectorAll('.hotspot');
      spots.forEach(function(spot){
        spot.setAttribute('tabindex', '0');
        spot.setAttribute('role', 'button');
        function activate(){
          spots.forEach(function(s){ s.classList.remove('is-active'); });
          spot.classList.add('is-active');
          if (note){
            var titleTh = spot.dataset.titleTh;
            var noteTh = spot.dataset.noteTh;
            var html = '<strong>' + spot.dataset.title + '.</strong> ' + spot.dataset.note;
            if (titleTh || noteTh){
              html += '<span class="lang-th"><strong>' + (titleTh || '') + '.</strong> ' + (noteTh || '') + '</span>';
            }
            note.innerHTML = html;
          }
        }
        spot.addEventListener('click', activate);
        spot.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); }
        });
      });
    });
  }

  function initTabs(){
    document.querySelectorAll('.tab-group').forEach(function(group){
      var buttons = group.querySelectorAll('.tab-btn');
      var panels = group.querySelectorAll('.tab-panel');
      buttons.forEach(function(btn){
        btn.addEventListener('click', function(){
          buttons.forEach(function(b){ b.classList.remove('is-active'); });
          panels.forEach(function(p){ p.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var target = group.querySelector('.tab-panel[data-tab-panel="' + btn.dataset.tab + '"]');
          if (target) target.classList.add('is-active');
        });
      });
    });
  }

  function initQuizzes(){
    document.querySelectorAll('.quiz').forEach(function(quiz){
      var scoreEl = quiz.querySelector('[data-quiz-score]');
      var questions = quiz.querySelectorAll('.quiz-q');
      var total = questions.length;
      var correctCount = 0;
      var answeredCount = 0;

      function updateScore(){
        if (!scoreEl) return;
        if (answeredCount === 0){
          scoreEl.textContent = 'Answer the ' + total + ' question' + (total === 1 ? '' : 's') + ' above to see your score.';
        } else if (answeredCount === total){
          scoreEl.textContent = 'Score: ' + correctCount + ' / ' + total + ' — ' +
            (correctCount === total ? 'excellent work!' : 'review the highlighted answers above and try the next module.');
        } else {
          scoreEl.textContent = 'Score so far: ' + correctCount + ' / ' + answeredCount + ' answered';
        }
      }
      updateScore();

      questions.forEach(function(q){
        var options = q.querySelectorAll('.quiz-option');
        var feedback = q.querySelector('.quiz-feedback');
        var locked = false;
        options.forEach(function(opt){
          opt.addEventListener('click', function(){
            if (locked) return;
            locked = true;
            answeredCount++;
            var isCorrect = opt.dataset.correct === 'true';
            options.forEach(function(o){ o.disabled = true; });

            if (isCorrect){
              opt.classList.add('is-correct');
              correctCount++;
            } else {
              opt.classList.add('is-wrong');
              var correctOpt = q.querySelector('.quiz-option[data-correct="true"]');
              if (correctOpt) correctOpt.classList.add('is-correct');
            }

            if (feedback){
              var fbEn = opt.dataset.feedback || (isCorrect ? 'Correct!' : 'Not quite.');
              var fbTh = opt.dataset.feedbackTh;
              feedback.innerHTML = fbEn + (fbTh ? '<span class="lang-th">' + fbTh + '</span>' : '');
              feedback.classList.add(isCorrect ? 'correct' : 'wrong');
            }
            updateScore();
          });
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    initHeader();
    initReveal();
    initFlipCards();
    initHotspots();
    initTabs();
    initQuizzes();
    if (typeof window.initPageExtras === 'function') window.initPageExtras();
  });
})();
